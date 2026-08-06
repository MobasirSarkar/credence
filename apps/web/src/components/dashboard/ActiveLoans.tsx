/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Receipt, Wallet } from 'lucide-react';
import { EmptyState } from '@/components/empty-state/EmptyState';
import { SectionHeader } from '@/components/section-header/SectionHeader';
import { LoanCard } from './LoanCard';
import type { LoanDTO } from '@lms/shared';

interface ActiveLoansProps {
  loans: LoanDTO[];
}

export function ActiveLoans({ loans }: ActiveLoansProps) {
  return (
    <section aria-label="Active loans" className="space-y-4 pt-4">
      <SectionHeader
        icon={Receipt}
        title="Active Loan Lifecycle"
        count={loans.length}
        iconClassName="text-brand-blue"
        countClassName="bg-brand-blue-tint text-brand-blue"
      />
      {loans.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No active loans yet"
          description="Once your application is approved and disbursed by the underwriter, your loan schedule will appear here."
        />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
          {loans.map((l) => (
            <li key={l.id}>
              <LoanCard loan={l} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
