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

  if (!q.data) return <main className="p-6">Loading…</main>;
  const a = q.data.application;
  const ruleRec = a.recommendation;

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto space-y-4">
      <Link to="/admin" className="text-sm underline">← Back to queue</Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Application</CardTitle>
          <StatusBadge status={a.status} />
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>Amount: <Money cents={a.amount} /></p>
          <p>Term: {a.termMonths} months · Rate: {(a.annualRateBps / 100).toFixed(2)}%</p>
          <p>Purpose: {a.purpose}</p>
          <p>Employment: {a.employment}</p>
          <p>Submitted: {a.createdAt}</p>
          {a.decisionReason && <p>Decision reason: {a.decisionReason}</p>}
        </CardContent>
      </Card>

      {a.status === 'pending' && ruleRec && (
        <Card>
          <CardHeader><CardTitle>Rule recommendation</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm">
              Recommendation: <strong>{ruleRec.rule}</strong>
              {ruleRec.reason && <> — {ruleRec.reason}</>}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Admin can override.</p>
          </CardContent>
        </Card>
      )}

      {a.status === 'pending' && (
        <Card>
          <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Reason (optional for approve, required for reject)" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={() => decide.mutate({ id: a.id, input: { decision: 'approve', reason: reason || 'Approved' } }, { onSuccess: () => { q.refetch(); toast.success('Approved'); }, onError: (e) => toast.error((e as Error).message) })}>Approve</Button>
              <Button variant="destructive" disabled={!reason} onClick={() => decide.mutate({ id: a.id, input: { decision: 'reject', reason } }, { onSuccess: () => { q.refetch(); toast.success('Rejected'); }, onError: (e) => toast.error((e as Error).message) })}>Reject</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {a.status === 'approved' && (
        <Card>
          <CardHeader><CardTitle>Disburse</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => disburse.mutate(a.id, { onSuccess: () => { toast.success('Disbursed'); nav('/admin'); }, onError: (e) => toast.error((e as Error).message) })}>Disburse loan</Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
