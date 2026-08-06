/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDecideApplication, useDisburse } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Money } from '@/components/Money';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ApplicationDTO } from '@lms/shared';
import { ArrowLeft, CircleAlert, Loader2, Sparkles, ShieldCheck, Check, X, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/format';

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
    return <LoadingScreen text="Loading Application..." />;
  }

  if (q.error || !q.data) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-8 shadow-[5px_5px_0px_#2C40A7] text-center space-y-4">
          <CircleAlert className="size-12 text-[#DC2626] mx-auto" />
          <h1 className="text-2xl font-extrabold">Application Not Found</h1>
          <Button render={<Link to="/admin" />}>
            <ArrowLeft className="size-4" />
            Back to Queue
          </Button>
        </div>
      </main>
    );
  }

  const a = q.data.application;
  const ruleRec = a.recommendation;

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans selection:bg-[#F237A1] selection:text-white pb-20">
      
      {/* Top Header */}
      <header className="border-b-2 border-[#2C40A7] bg-[#FAF7F0] sticky top-0 z-40">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/admin" className="flex items-center gap-2 text-sm font-bold hover:text-[#F237A1] transition-colors">
            <ArrowLeft className="size-4 stroke-[2.5]" />
            Back to Underwriting Queue
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#2C40A7]/70">APP #{a.id.slice(0, 8)}</span>
            <StatusBadge status={a.status} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 pt-8 space-y-6">
        
        {/* Application Card */}
        <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-8 shadow-[5px_5px_0px_#2C40A7] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#2C40A7]/20 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block">
                APPLICATION DETAILS
              </span>
              <h1 className="text-3xl font-extrabold font-mono text-[#2C40A7] mt-0.5">
                <Money cents={a.amount} />
              </h1>
            </div>
            <StatusBadge status={a.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs font-bold bg-[#FAF7F0] p-4 rounded-xl border-2 border-[#2C40A7]">
            <div>
              <span className="text-[#2C40A7]/60 block text-[10px]">TENURE</span>
              <span className="text-sm">{a.termMonths} Months</span>
            </div>
            <div>
              <span className="text-[#2C40A7]/60 block text-[10px]">RATE</span>
              <span className="text-sm">{(a.annualRateBps / 100).toFixed(2)}% APR</span>
            </div>
            <div>
              <span className="text-[#2C40A7]/60 block text-[10px]">EMPLOYMENT</span>
              <span className="text-sm capitalize">{a.employment}</span>
            </div>
            <div>
              <span className="text-[#2C40A7]/60 block text-[10px]">SUBMITTED</span>
              <span className="text-sm">{formatDate(a.createdAt)}</span>
            </div>
          </div>

          <div className="space-y-1 font-mono text-xs font-bold">
            <span className="text-[#2C40A7]/70 block text-[10px] uppercase">PURPOSE</span>
            <div className="bg-[#FFFDF8] p-3 rounded-lg border border-[#2C40A7] text-sm font-sans font-medium text-[#2C40A7]">
              {a.purpose}
            </div>
          </div>

          {a.decisionReason && (
            <div className="space-y-1 font-mono text-xs font-bold">
              <span className="text-[#F237A1] block text-[10px] uppercase">DECISION REASON</span>
              <div className="bg-[#FDE8F3] p-3 rounded-lg border-2 border-[#2C40A7] text-sm text-[#2C40A7]">
                {a.decisionReason}
              </div>
            </div>
          )}
        </div>

        {/* Rule Recommendation Banner */}
        {a.status === 'pending' && ruleRec && (
          <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FDE8F3] p-6 shadow-[4px_4px_0px_#2C40A7] flex items-start gap-4">
            <div className="size-10 rounded-xl bg-[#F237A1] text-white border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7] flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F237A1]">
                AUTOMATED UNDERWRITING RULE RECOMMENDATION
              </span>
              <div className="text-lg font-extrabold text-[#2C40A7] capitalize">
                Rule Suggests: {ruleRec.rule}
              </div>
              {ruleRec.reason && (
                <p className="text-xs font-mono font-bold text-[#2C40A7]/80">
                  Reason: {ruleRec.reason}
                </p>
              )}
              <p className="text-[11px] font-mono text-[#2C40A7]/60 pt-1">
                The underwriting engine is advisory — as an admin, you can approve or override.
              </p>
            </div>
          </div>
        )}

        {/* Admin Decision Actions */}
        {a.status === 'pending' && (
          <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-6 shadow-[5px_5px_0px_#2C40A7] space-y-4">
            <h3 className="font-extrabold text-lg text-[#2C40A7]">Underwriter Action</h3>
            <Input
              placeholder="Reason / Admin Note (Optional for Approve, Required for Reject)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                disabled={decide.isPending}
                onClick={() =>
                  decide.mutate(
                    { id: a.id, input: { decision: 'approve', reason: reason || 'Approved by underwriter' } },
                    {
                      onSuccess: () => {
                        q.refetch();
                        toast.success('Application Approved');
                      },
                      onError: (e) => toast.error((e as Error).message),
                    }
                  )
                }
              >

                {decide.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4 stroke-[3]" />}
                Approve Application
              </Button>
              <Button
                variant="destructive"
                disabled={decide.isPending || !reason.trim()}
                onClick={() =>
                  decide.mutate(
                    { id: a.id, input: { decision: 'reject', reason } },
                    {
                      onSuccess: () => {
                        q.refetch();
                        toast.success('Application Rejected');
                      },
                      onError: (e) => toast.error((e as Error).message),
                    }
                  )
                }
              >
                {decide.isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4 stroke-[3]" />}
                Reject Application
              </Button>
            </div>
          </div>
        )}

        {/* Disburse Button for Approved Applications */}
        {a.status === 'approved' && (
          <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-6 shadow-[5px_5px_0px_#2C40A7] space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6 text-[#F237A1]" />
              <div>
                <h3 className="font-extrabold text-lg text-[#2C40A7]">Ready for Disbursement</h3>
                <p className="text-xs font-medium text-[#2C40A7]/80">
                  Disbursing generates the 12-month amortization schedule and creates the active loan.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full sm:w-auto"
              disabled={disburse.isPending}
              onClick={() =>
                disburse.mutate(a.id, {
                  onSuccess: (data) => {
                    toast.success('Loan Disbursed Successfully!');
                    nav(`/loans/${data.loan.id}`);
                  },
                  onError: (e) => toast.error((e as Error).message),
                })
              }
            >
              {disburse.isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Generating Schedule...
                </>
              ) : (
                <>
                  Disburse Loan & Generate Amortization Schedule
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </div>
        )}

      </div>
    </main>
  );
}
