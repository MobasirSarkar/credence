/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Money } from '@/components/money/Money';
import { ProgressBar } from '@/components/progress-bar/ProgressBar';
import { formatDate } from '@/lib/format';

interface LoanSummaryProps {
  principalCents: number;
  outstandingCents: number;
  termMonths: number;
  annualRateBps: number;
  paidCount: number;
  totalCount: number;
  startDate: string;
  endDate: string;
}

const CARD_CLS = 'rounded-xl border-2 border-brand-blue bg-brand-card p-5 riso-shadow';
const LABEL_CLS = 'text-[10px] font-mono font-bold uppercase tracking-wider text-brand-blue/70 block mb-1';

export function LoanSummary({
  principalCents,
  outstandingCents,
  termMonths,
  annualRateBps,
  paidCount,
  totalCount,
  startDate,
  endDate,
}: LoanSummaryProps) {
  const percentPaid = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <section
      aria-labelledby="loan-summary-heading"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <h2 id="loan-summary-heading" className="sr-only">
        Loan summary
      </h2>

      <article className={CARD_CLS}>
        <span className={LABEL_CLS}>Principal Borrowed</span>
        <p className="text-2xl font-extrabold font-mono text-brand-blue">
          <Money cents={principalCents} />
        </p>
        <span className="text-xs font-bold text-brand-blue/70 mt-2 block">
          {termMonths} Months @ {(annualRateBps / 100).toFixed(2)}% APR
        </span>
      </article>

      <article className={CARD_CLS}>
        <span className={LABEL_CLS}>Outstanding Principal</span>
        <p className="text-2xl font-extrabold font-mono text-brand-pink">
          <Money cents={outstandingCents} />
        </p>
        <span className="text-xs font-bold text-brand-blue/70 mt-2 block">Remaining balance</span>
      </article>

      <article className={CARD_CLS}>
        <span className={LABEL_CLS}>Installments Progress</span>
        <p className="text-2xl font-extrabold font-mono text-brand-blue">
          {paidCount} / {totalCount}
        </p>
        <div className="mt-2">
          <ProgressBar
            width={percentPaid}
            fillColor="bg-brand-pink"
            trackColor="bg-brand-pink-tint"
            size="sm"
            label={`Installments paid: ${paidCount} of ${totalCount}`}
          />
        </div>
      </article>

      <article className={CARD_CLS}>
        <span className={LABEL_CLS}>Schedule Dates</span>
        <dl className="text-xs font-mono font-bold text-brand-blue space-y-1">
          <div className="flex justify-between">
            <dt className="text-brand-blue/70">Start:</dt>
            <dd>{formatDate(startDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-brand-blue/70">End:</dt>
            <dd>{formatDate(endDate)}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
