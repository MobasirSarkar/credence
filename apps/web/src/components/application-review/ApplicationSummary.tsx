/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { StatusBadge } from '@/components/StatusBadge';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import type { ApplicationDTO } from '@lms/shared';

interface ApplicationSummaryProps {
  application: ApplicationDTO;
}

export function ApplicationSummary({ application }: ApplicationSummaryProps) {
  const a = application;
  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-2xl border-2 border-brand-blue bg-brand-card p-8 riso-shadow-lg space-y-6"
    >
      <header className="flex items-center justify-between border-b-2 border-brand-blue/20 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue/70 block">
            Application Details
          </span>
          <h1 id="summary-heading" className="text-3xl font-extrabold font-mono text-brand-blue mt-0.5">
            <Money cents={a.amount} />
          </h1>
        </div>
        <StatusBadge status={a.status} />
      </header>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs font-bold bg-brand-paper p-4 rounded-xl border-2 border-brand-blue">
        <div>
          <dt className="text-brand-blue/60 block text-[10px]">Tenure</dt>
          <dd className="text-sm">{a.termMonths} Months</dd>
        </div>
        <div>
          <dt className="text-brand-blue/60 block text-[10px]">Rate</dt>
          <dd className="text-sm">{(a.annualRateBps / 100).toFixed(2)}% APR</dd>
        </div>
        <div>
          <dt className="text-brand-blue/60 block text-[10px]">Employment</dt>
          <dd className="text-sm capitalize">{a.employment.replace('_', ' ')}</dd>
        </div>
        <div>
          <dt className="text-brand-blue/60 block text-[10px]">Submitted</dt>
          <dd className="text-sm">{formatDate(a.createdAt)}</dd>
        </div>
      </dl>

      <div className="space-y-1 font-mono text-xs font-bold">
        <span className="text-brand-blue/70 block text-[10px] uppercase">Purpose</span>
        <div className="bg-brand-card p-3 rounded-lg border border-brand-blue text-sm font-sans font-medium text-brand-blue">
          {a.purpose}
        </div>
      </div>

      {a.decisionReason && (
        <div className="space-y-1 font-mono text-xs font-bold">
          <span className="text-brand-pink block text-[10px] uppercase">Decision Reason</span>
          <div className="bg-brand-pink-tint p-3 rounded-lg border-2 border-brand-blue text-sm text-brand-blue">
            {a.decisionReason}
          </div>
        </div>
      )}
    </section>
  );
}
