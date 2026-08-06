/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/money/Money';
import { formatDate } from '@/lib/format';
import { TableCell, TableRow } from '@/components/ui/table';
import type { UnderwritingApplication } from '@/hooks/useUnderwritingReview';

interface ApplicationRowProps {
  application: UnderwritingApplication;
  onReview: (id: string) => void;
}

export function ApplicationRow({ application, onReview }: ApplicationRowProps) {
  const app = application;
  const income = app.applicant.monthlyIncome;
  return (
    <TableRow>
      <TableCell className="font-bold">
        <div className="flex items-center gap-2">
          <User className="size-4 text-brand-pink" aria-hidden="true" />
          <div>
            <div>{app.applicant.fullName}</div>
            <div className="text-xs text-brand-blue/60 font-mono font-normal">{app.applicant.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-mono font-extrabold text-brand-pink">
        <Money cents={app.amount} />
      </TableCell>
      <TableCell className="font-mono font-bold">{app.termMonths}m</TableCell>
      <TableCell className="font-mono font-bold">{(app.annualRateBps / 100).toFixed(2)}%</TableCell>
      <TableCell className="font-mono font-bold">
        {income ? <Money cents={income} /> : '—'}
      </TableCell>
      <TableCell className="font-mono text-xs">{formatDate(app.createdAt)}</TableCell>
      <TableCell className="text-right">
        <Button size="xs" onClick={() => onReview(app.id)}>
          Review Application
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
