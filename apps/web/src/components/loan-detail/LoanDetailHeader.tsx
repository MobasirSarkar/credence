/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

interface LoanDetailHeaderProps {
  loanId: string;
  status: string;
}

export function LoanDetailHeader({ loanId, status }: LoanDetailHeaderProps) {
  return (
    <header className="border-b-2 border-brand-blue bg-brand-paper sticky top-0 z-40">
      <nav
        aria-label="Loan detail navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-pink transition-colors"
        >
          <ArrowLeft className="size-4 stroke-[2.5]" aria-hidden="true" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-brand-blue/70">
            LOAN #{loanId.slice(0, 8)}
          </span>
          <StatusBadge status={status} />
        </div>
      </nav>
    </header>
  );
}
