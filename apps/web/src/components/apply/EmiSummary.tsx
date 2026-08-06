/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Calculator, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/lib/format';

interface EmiSummaryProps {
  principalCents: number;
  emiCents: number;
  totalInterestCents: number;
  totalRepaymentCents: number;
}

export function EmiSummary({
  principalCents,
  emiCents,
  totalInterestCents,
  totalRepaymentCents,
}: EmiSummaryProps) {
  return (
    <aside
      aria-label="Live loan estimate"
      className="lg:col-span-5 rounded-2xl border-2 border-brand-blue bg-brand-pink-tint p-6 riso-shadow-lg space-y-5 sticky top-24"
    >
      <header className="flex items-center gap-2 border-b-2 border-brand-blue pb-3">
        <Calculator className="size-5 text-brand-pink" aria-hidden="true" />
        <h3 className="font-extrabold text-base text-brand-blue">Live Loan Estimate</h3>
      </header>

      <dl className="space-y-3 font-mono text-xs font-bold text-brand-blue">
        <div className="bg-brand-card p-4 rounded-xl border-2 border-brand-blue riso-shadow-sm">
          <dt className="text-[10px] text-brand-blue/70 uppercase block mb-1">
            Estimated Monthly EMI
          </dt>
          <dd className="text-3xl font-extrabold text-brand-pink">
            {formatINR(emiCents)}
            <span className="text-xs font-normal text-brand-blue/70"> / mo</span>
          </dd>
        </div>

        <div className="bg-brand-card p-3 rounded-lg border border-brand-blue/40 space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-brand-blue/70">Principal:</dt>
            <dd>{formatINR(principalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-brand-blue/70">Est. Total Interest:</dt>
            <dd>{formatINR(totalInterestCents)}</dd>
          </div>
          <div className="flex justify-between pt-1 border-t border-brand-blue/20 text-brand-blue">
            <dt>Est. Total Payable:</dt>
            <dd>{formatINR(totalRepaymentCents)}</dd>
          </div>
        </div>
      </dl>

      <p className="flex items-center gap-2 text-xs font-bold text-brand-blue">
        <ShieldCheck className="size-4 text-brand-pink shrink-0" aria-hidden="true" />
        <span>Instant rule-based underwriting on submission</span>
      </p>
    </aside>
  );
}
