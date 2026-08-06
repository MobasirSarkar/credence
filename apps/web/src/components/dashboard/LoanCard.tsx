/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge/StatusBadge';
import { Money } from '@/components/money/Money';
import { ProgressBar } from '@/components/progress-bar/ProgressBar';
import { formatDate } from '@/lib/format';
import type { LoanDTO } from '@lms/shared';

interface LoanCardProps {
  loan: LoanDTO;
}

export function LoanCard({ loan }: LoanCardProps) {
  const percentPaid = Math.round(((loan.principal - loan.outstanding) / loan.principal) * 100);
  return (
    <Card className="p-5 riso-shadow-sm hover:translate-x-px hover:translate-y-px transition-all flex flex-col justify-between h-full">
      <div>
        <header className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[10px] font-mono font-bold text-brand-blue/60 uppercase tracking-wider">
              LOAN ID #{loan.id.slice(0, 8)}
            </p>
            <h3 className="text-xl font-extrabold font-mono text-brand-blue">
              <Money cents={loan.principal} />
            </h3>
          </div>
          <StatusBadge status={loan.status} />
        </header>

        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-brand-blue">Repayment Progress</span>
            <span className="text-brand-pink">{percentPaid}% Paid</span>
          </div>
          <ProgressBar
            width={percentPaid}
            fillColor="bg-brand-pink"
            label={`Loan ${loan.id} repayment`}
          />
        </div>

        <dl className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-brand-paper p-3 rounded-lg border border-brand-blue/30 mb-3">
          <div>
            <dt className="text-brand-blue/60 text-[10px]">Outstanding</dt>
            <dd className="text-brand-pink font-bold">
              <Money cents={loan.outstanding} />
            </dd>
          </div>
          <div>
            <dt className="text-brand-blue/60 text-[10px]">Tenure / Rate</dt>
            <dd>
              {loan.termMonths}m @ {(loan.annualRateBps / 100).toFixed(2)}%
            </dd>
          </div>
        </dl>
      </div>

      <footer className="flex items-center justify-between pt-3 border-t border-brand-blue/20">
        <span className="text-xs font-mono font-bold text-brand-blue/70">
          Start: {formatDate(loan.startDate)}
        </span>
        <Link to={`/loans/${loan.id}`}>
          <Button size="sm">
            Manage &amp; Pay EMI
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </footer>
    </Card>
  );
}
