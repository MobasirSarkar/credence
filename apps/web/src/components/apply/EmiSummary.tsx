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
      className="rounded-2xl border-2 border-[#2C40A7] bg-[#FDE8F3] p-6 shadow-[5px_5px_0px_#2C40A7] space-y-5 sticky top-24"
    >
      <header className="flex items-center gap-2 border-b-2 border-[#2C40A7] pb-3">
        <Calculator className="size-5 text-[#F237A1]" aria-hidden="true" />
        <h3 className="font-extrabold text-base text-[#2C40A7]">Live Loan Estimate</h3>
      </header>

      <dl className="space-y-3 font-mono text-xs font-bold text-[#2C40A7]">
        <div className="bg-[#FFFDF8] p-4 rounded-xl border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]">
          <dt className="text-[10px] text-[#2C40A7]/70 uppercase block mb-1">
            Estimated Monthly EMI
          </dt>
          <dd className="text-3xl font-extrabold text-[#F237A1]">
            {formatINR(emiCents)}
            <span className="text-xs font-normal text-[#2C40A7]/70"> / mo</span>
          </dd>
        </div>

        <div className="bg-[#FFFDF8] p-3 rounded-lg border border-[#2C40A7]/40 space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-[#2C40A7]/70">Principal:</dt>
            <dd>{formatINR(principalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#2C40A7]/70">Est. Total Interest:</dt>
            <dd>{formatINR(totalInterestCents)}</dd>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#2C40A7]/20 text-[#2C40A7]">
            <dt>Est. Total Payable:</dt>
            <dd>{formatINR(totalRepaymentCents)}</dd>
          </div>
        </div>
      </dl>

      <p className="flex items-center gap-2 text-xs font-bold text-[#2C40A7]">
        <ShieldCheck className="size-4 text-[#F237A1] shrink-0" aria-hidden="true" />
        <span>Instant rule-based underwriting on submission</span>
      </p>
    </aside>
  );
}
