/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { CheckCircle2 } from 'lucide-react';

const QUICK_BENEFITS = [
  'Instant Underwriting',
  'Fixed 12% - 15% APR',
  'Zero Hidden Fees',
] as const;

export function HeroBenefits() {
  return (
    <ul className="mt-10 pt-8 border-t-2 border-brand-blue/20 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full list-none">
      {QUICK_BENEFITS.map((benefit) => (
        <li key={benefit} className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-brand-pink shrink-0 stroke-[2.5]" aria-hidden="true" />
          <span className="text-xs font-bold text-brand-blue">{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
