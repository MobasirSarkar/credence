/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDecideApplication, useDisburse } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Money } from '@/components/Money';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ApplicationDTO } from '@lms/shared';
import { ArrowLeft, CircleAlert, Loader2, Sparkles } from 'lucide-react';

export function AdminApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const q = useQuery({
    queryKey: ['admin', 'application', id],
    queryFn: () => apiFetch<{ application: ApplicationDTO }>(`/api/applications/${id}`),
    enabled: !!id,
  });
  const decide = useDecideApplication();
  const disburse = useDisburse();
  const nav = useNavigate();
  const [reason, setReason] = useState('');

  if (q.isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-6 py-20 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" /> Loading application
        </div>
      </main>
    );
  }

  if (q.error || !q.data) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-20 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleAlert className="size-5" />
          </span>
          <p className="text-sm text-destructive">Could not load application.</p>
          <Button variant="outline" size="sm" render={<Link to="/admin" />}>
            <ArrowLeft /> Back to queue
          </Button>
        </div>
      </main>
    );
  }

  const a = q.data.application;
  const ruleRec = a.recommendation;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Button variant="ghost" size="sm" render={<Link to="/admin" />}>
            <ArrowLeft />
            Queue
          </Button>
          <StatusBadge status={a.status} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Row label="Amount" value={<Money cents={a.amount} />} />
              <Row label="Term" value={`${a.termMonths} months`} />
              <Row label="Rate" value={`${(a.annualRateBps / 100).toFixed(2)}%`} />
              <Row label="Employment" value={a.employment === 'salaried' ? 'Salaried' : 'Self-employed'} />
              <div className="sm:col-span-2"><Row label="Purpose" value={a.purpose} /></div>
              <Row label="Submitted" value={new Date(a.createdAt).toLocaleString('en-IN')} />
              {a.decisionReason ? <div className="sm:col-span-2"><Row label="Decision reason" value={a.decisionReason} /></div> : null}
            </dl>
          </CardContent>
        </Card>

        {a.status === 'pending' && ruleRec && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-muted-foreground" /> Rule recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Recommendation: <strong className="capitalize">{ruleRec.rule}</strong>
                {ruleRec.reason ? <> — {ruleRec.reason}</> : null}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Admin can override.</p>
            </CardContent>
          </Card>
        )}

        {a.status === 'pending' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Reason (optional for approve, required for reject)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    decide.mutate(
                      { id: a.id, input: { decision: 'approve', reason: reason || 'Approved' } },
                      {
                        onSuccess: () => {
                          q.refetch();
                          setReason('');
                          toast.success('Approved');
                        },
                        onError: (e) => toast.error((e as Error).message),
                      }
                    )
                  }
                  disabled={decide.isPending}
                >
                  {decide.isPending ? <Loader2 className="animate-spin" /> : null}
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  disabled={!reason || decide.isPending}
                  onClick={() =>
                    decide.mutate(
                      { id: a.id, input: { decision: 'reject', reason } },
                      {
                        onSuccess: () => {
                          q.refetch();
                          setReason('');
                          toast.success('Rejected');
                        },
                        onError: (e) => toast.error((e as Error).message),
                      }
                    )
                  }
                >
                  {decide.isPending ? <Loader2 className="animate-spin" /> : null}
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {a.status === 'approved' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disburse</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  disburse.mutate(a.id, {
                    onSuccess: () => {
                      toast.success('Disbursed');
                      nav('/admin');
                    },
                    onError: (e) => toast.error((e as Error).message),
                  })
                }
                disabled={disburse.isPending}
              >
                {disburse.isPending ? <Loader2 className="animate-spin" /> : null}
                Disburse loan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}
