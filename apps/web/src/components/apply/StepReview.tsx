/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { ApplicationInput } from '@lms/shared';
import { formatINR } from '@/lib/format';

interface StepReviewProps {
  values: ApplicationInput;
}

export function StepReview({ values }: StepReviewProps) {
  const rows = [
    { label: 'Requested Amount', value: formatINR(values.amount) },
    { label: 'Tenure', value: `${values.termMonths} Months` },
    { label: 'Interest Rate', value: `${(values.annualRateBps / 100).toFixed(2)}% APR` },
    {
      label: 'Purpose',
      value: <span className="capitalize">{values.purpose}</span>,
    },
    {
      label: 'Employment',
      value: <span className="capitalize">{values.employment.replace('_', ' ')}</span>,
    },
  ];

  return (
    <section
      aria-labelledby="review-heading"
      className="rounded-xl border-2 border-brand-blue bg-brand-paper p-4 font-mono text-xs font-bold text-brand-blue"
    >
      <h3 id="review-heading" className="sr-only">
        Application review
      </h3>
      <dl className="divide-y divide-brand-blue/20">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between py-2">
            <dt className="text-brand-blue/70">{r.label.toUpperCase()}:</dt>
            <dd className="text-brand-blue text-sm">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
