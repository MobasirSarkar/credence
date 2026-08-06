/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge/StatusBadge';
import { Money } from '@/components/money/Money';
import { formatDate } from '@/lib/format';
import type { ApplicationDTO } from '@lms/shared';

interface ApplicationCardProps {
  application: ApplicationDTO;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card className="p-5 riso-shadow-sm hover:translate-x-px hover:translate-y-px transition-all flex flex-col justify-between h-full">
      <div>
        <header className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[10px] font-mono font-bold text-brand-blue/60 uppercase tracking-wider">
              APPLICATION #{application.id.slice(0, 8)}
            </p>
            <h3 className="text-xl font-extrabold font-mono text-brand-blue">
              <Money cents={application.amount} />
            </h3>
          </div>
          <StatusBadge status={application.status} />
        </header>
        <dl className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-brand-paper p-3 rounded-lg border border-brand-blue/30 mb-3">
          <div>
            <dt className="text-brand-blue/60 text-[10px]">Tenure</dt>
            <dd>{application.termMonths} Months</dd>
          </div>
          <div>
            <dt className="text-brand-blue/60 text-[10px]">Interest Rate</dt>
            <dd>{(application.annualRateBps / 100).toFixed(2)}% APR</dd>
          </div>
          <div className="col-span-2 pt-1 border-t border-brand-blue/10">
            <dt className="text-brand-blue/60 text-[10px]">Purpose</dt>
            <dd className="capitalize">{application.purpose}</dd>
          </div>
        </dl>
      </div>
      <footer className="flex items-center justify-between pt-2 text-xs font-mono font-bold border-t border-brand-blue/20">
        <span className="text-brand-blue/70">Submitted {formatDate(application.createdAt)}</span>
        {application.status === 'disbursed' && (
          <Link
            to={`/loans/${application.id}`}
            className="text-brand-pink hover:underline flex items-center gap-1 font-bold"
          >
            View Active Loan <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </footer>
    </Card>
  );
}
