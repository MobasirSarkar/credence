/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Wallet, Zap } from 'lucide-react';
import { PillarCard, type PillarSpec } from './PillarCard';

const PILLARS: readonly PillarSpec[] = [
  {
    icon: Zap,
    iconBg: 'bg-brand-pink',
    iconShadow: 'riso-shadow-sm',
    eyebrowClassName: 'text-brand-pink',
    eyebrow: 'Pillar 01',
    title: 'Loan Origination System (LOS)',
    description:
      'From initial application form to rule-based underwriting decision. Calculates Debt-to-Income (FOIR) instantly to provide automated approval recommendations.',
    items: [
      'Instant FOIR (Fixed Obligation to Income Ratio) Evaluation',
      'Automated Pre-qualification Engine',
      'Underwriter Review Queue & One-click Disbursement',
    ],
    firstDot: 'bg-brand-pink',
  },
  {
    icon: Wallet,
    iconBg: 'bg-brand-blue',
    iconShadow: 'riso-shadow-pink',
    eyebrowClassName: 'text-brand-blue',
    eyebrow: 'Pillar 02',
    title: 'Loan Management System (LMS)',
    description:
      'Complete post-disbursement lifecycle management. Automated reducing-balance amortization schedules, EMI tracking, and single-click installment recording.',
    items: [
      'Reducing-Balance Amortization Engine',
      'Real-time Outstanding Principal Recalculation',
      'Instant Mock EMI Payment & Status Tracking',
    ],
    firstDot: 'bg-brand-pink',
  },
];

export function PillarsSection() {
  return (
    <section id="features" aria-labelledby="features-heading" className="border-t-2 border-brand-blue bg-brand-card py-20">
      <div className="mx-auto max-w-6xl px-6">
        <header className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-pink-tint text-brand-blue border-2 border-brand-blue riso-shadow-sm">
            Designed for Simplicity
          </span>
          <h2 id="features-heading" className="mt-4 text-3xl sm:text-4xl font-extrabold text-brand-blue">
            Two core pillars powering your loan journey
          </h2>
          <p className="mt-3 text-base text-brand-blue/80 font-medium">
            Loan Origination (LOS) handles instant application &amp; automated approval. Loan
            Management (LMS) tracks payments &amp; interest accrual.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 list-none">
          {PILLARS.map((p) => (
            <li key={p.title}>
              <PillarCard {...p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
