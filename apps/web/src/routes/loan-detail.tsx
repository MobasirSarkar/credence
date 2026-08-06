/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link, useParams } from 'react-router-dom';
import { useLoan, usePayInstallment } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ArrowLeft, CircleAlert, Loader2, Receipt, TrendingUp, Wallet, Check, Calendar, ShieldCheck } from 'lucide-react';

export function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const q = useLoan(id);
  const pay = usePayInstallment(id ?? '');

  if (q.isLoading) {
    return <LoadingScreen text="Loading Loan Lifecycle..." />;
  }

  if (q.error || !q.data) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-8 shadow-[5px_5px_0px_#2C40A7] text-center space-y-4">
          <CircleAlert className="size-12 text-[#DC2626] mx-auto" />
          <h1 className="text-2xl font-extrabold">Loan Not Found</h1>
          <p className="text-sm text-[#2C40A7]/80 font-medium">The requested loan details could not be loaded.</p>
          <Button render={<Link to="/dashboard" />}>
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  const { loan, installments } = q.data;
  const next = installments.find((i) => !i.paidAt);
  const paidCount = installments.filter((i) => i.paidAt).length;
  const totalCount = installments.length;
  const percentPaid = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans selection:bg-[#F237A1] selection:text-white pb-20">
      
      {/* Top Header */}
      <header className="border-b-2 border-[#2C40A7] bg-[#FAF7F0] sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold hover:text-[#F237A1] transition-colors">
            <ArrowLeft className="size-4 stroke-[2.5]" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#2C40A7]/70">LOAN #{loan.id.slice(0, 8)}</span>
            <StatusBadge status={loan.status} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 pt-8 space-y-8">
        
        {/* Loan Title & Stats Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#2C40A7]/20 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2C40A7]/70">
              REPAYMENT LIFECYCLE
            </span>
            <h1 className="text-3xl font-extrabold text-[#2C40A7] flex items-center gap-3 mt-1">
              Personal Loan — <Money cents={loan.principal} />
            </h1>
          </div>
          {next && loan.status === 'active' && (
            <Button
              size="lg"
              disabled={pay.isPending}
              onClick={() =>
                pay.mutate(next.sequence, {
                  onSuccess: () => toast.success(`EMI #${next.sequence} Paid Successfully`),
                  onError: (e) => toast.error((e as Error).message),
                })
              }
            >
              {pay.isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay Next EMI (<Money cents={next.principalDue + next.interestDue} />)
                  <ArrowLeft className="size-4 rotate-180" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              PRINCIPAL BORROWED
            </span>
            <div className="text-2xl font-extrabold font-mono text-[#2C40A7]">
              <Money cents={loan.principal} />
            </div>
            <span className="text-xs font-bold text-[#2C40A7]/70 mt-2 block">
              {loan.termMonths} Months @ {(loan.annualRateBps / 100).toFixed(2)}% APR
            </span>
          </div>

          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              OUTSTANDING PRINCIPAL
            </span>
            <div className="text-2xl font-extrabold font-mono text-[#F237A1]">
              <Money cents={loan.outstanding} />
            </div>
            <span className="text-xs font-bold text-[#2C40A7]/70 mt-2 block">
              Remaining balance
            </span>
          </div>

          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              INSTALLMENTS PROGRESS
            </span>
            <div className="text-2xl font-extrabold font-mono text-[#2C40A7]">
              {paidCount} / {totalCount}
            </div>
            <div className="mt-2 h-2 w-full bg-[#FDE8F3] rounded-full overflow-hidden border border-[#2C40A7]">
              <div className="h-full bg-[#F237A1] rounded-full" style={{ width: `${percentPaid}%` }} />
            </div>
          </div>

          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              SCHEDULE DATES
            </span>
            <div className="text-xs font-mono font-bold text-[#2C40A7] space-y-1">
              <div>Start: {formatDate(loan.startDate)}</div>
              <div>End: {formatDate(loan.endDate)}</div>
            </div>
          </div>

        </div>

        {/* Installment Schedule Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="size-5 text-[#F237A1]" />
              <h2 className="text-xl font-extrabold text-[#2C40A7]">Amortization Schedule</h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#2C40A7]/70">
              Reducing Balance Calculations
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Total EMI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((inst) => {
                const totalDue = inst.principalDue + inst.interestDue;
                const isNext = next?.id === inst.id;
                const isPaid = !!inst.paidAt;

                return (
                  <TableRow
                    key={inst.id}
                    className={isNext ? 'bg-[#FDE8F3]/60 border-l-4 border-l-[#F237A1]' : ''}
                  >
                    <TableCell className="font-mono font-bold">{inst.sequence}</TableCell>
                    <TableCell className="font-mono font-bold">{formatDate(inst.dueDate)}</TableCell>
                    <TableCell><Money cents={inst.principalDue} /></TableCell>
                    <TableCell><Money cents={inst.interestDue} /></TableCell>
                    <TableCell className="font-bold text-[#2C40A7]"><Money cents={totalDue} /></TableCell>
                    <TableCell>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FDE8F3] text-[#2C40A7] border border-[#2C40A7]">
                          <Check className="size-3 text-[#F237A1] stroke-[3]" />
                          Paid {formatDate(inst.paidAt!)}
                        </span>
                      ) : isNext ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F237A1] text-white border border-[#2C40A7]">
                          Next Due
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FFFDF8] text-[#2C40A7]/70 border border-[#2C40A7]/40">
                          Upcoming
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isNext && loan.status === 'active' && (
                        <Button
                          size="xs"
                          disabled={pay.isPending}
                          onClick={() =>
                            pay.mutate(inst.sequence, {
                              onSuccess: () => toast.success(`EMI #${inst.sequence} Paid`),
                              onError: (e) => toast.error((e as Error).message),
                            })
                          }
                        >
                          {pay.isPending ? <Loader2 className="size-3 animate-spin" /> : 'Pay EMI'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

      </div>
    </main>
  );
}
