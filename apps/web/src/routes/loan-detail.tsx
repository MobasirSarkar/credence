/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLoan, usePayInstallment } from '@/hooks/useLoans';
import { LoadingScreen } from '@/components/loading-screen/LoadingScreen';
import { Money } from '@/components/money/Money';
import { Button } from '@/components/ui/button';
import { LoanDetailError } from '@/components/loan-detail/LoanDetailError';
import { LoanDetailHeader } from '@/components/loan-detail/LoanDetailHeader';
import { LoanSummary } from '@/components/loan-detail/LoanSummary';
import { InstallmentsTable } from '@/components/loan-detail/InstallmentsTable';
import { PayInstallmentButton } from '@/components/loan-detail/PayInstallmentButton';

export function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const q = useLoan(id);
  const pay = usePayInstallment(id ?? '');

  if (q.isLoading) return <LoadingScreen text="Loading Loan Lifecycle..." />;
  if (q.error || !q.data) return <LoanDetailError />;

  const { loan, installments } = q.data;
  const next = installments.find((i) => !i.paidAt);
  const paidCount = installments.filter((i) => i.paidAt).length;
  const totalCount = installments.length;
  const payNext = (sequence: number) =>
    pay.mutate(sequence, {
      onSuccess: () => toast.success(`EMI #${sequence} Paid`),
      onError: (e) => toast.error((e as Error).message),
    });

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-primary-foreground pb-20">
      <LoanDetailHeader loanId={loan.id} status={loan.status} />

      <div className="mx-auto max-w-6xl px-6 pt-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-brand-blue/20 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-blue/70">
              Repayment Lifecycle
            </span>
            <h1 className="text-3xl font-extrabold text-brand-blue flex items-center gap-3 mt-1">
              Personal Loan — <Money cents={loan.principal} />
            </h1>
          </div>
          {next && loan.status === 'active' && (
            <PayInstallmentButton
              isPending={pay.isPending}
              amountCents={next.principalDue + next.interestDue}
              onPay={() => payNext(next.sequence)}
              size="lg"
              variant="next"
            />
          )}
        </header>

        <LoanSummary
          principalCents={loan.principal}
          outstandingCents={loan.outstanding}
          termMonths={loan.termMonths}
          annualRateBps={loan.annualRateBps}
          paidCount={paidCount}
          totalCount={totalCount}
          startDate={loan.startDate}
          endDate={loan.endDate}
        />

        <InstallmentsTable
          installments={installments}
          loanStatus={loan.status}
          isPaying={pay.isPending}
          onPay={payNext}
        />
      </div>
    </main>
  );
}
