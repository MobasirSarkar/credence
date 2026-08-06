/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Check, Receipt } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import { SectionHeader } from '@/components/SectionHeader';
import { PayInstallmentButton } from './PayInstallmentButton';
import type { InstallmentDTO } from '@lms/shared';

interface InstallmentsTableProps {
  installments: InstallmentDTO[];
  loanStatus: string;
  isPaying: boolean;
  onPay: (sequence: number) => void;
}

const STATUS_PILL_CLS = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border border-brand-blue';

function InstallmentStatusPill({ installment, isNext }: { installment: InstallmentDTO; isNext: boolean }) {
  if (installment.paidAt) {
    return (
      <span className={`${STATUS_PILL_CLS} bg-brand-pink-tint text-brand-blue`}>
        <Check className="size-3 text-brand-pink stroke-3" aria-hidden="true" />
        Paid {formatDate(installment.paidAt)}
      </span>
    );
  }
  if (isNext) {
    return (
      <span className={`${STATUS_PILL_CLS} bg-brand-pink text-primary-foreground border-brand-blue`}>
        Next Due
      </span>
    );
  }
  return (
    <span className={`${STATUS_PILL_CLS} bg-brand-card text-brand-blue/70 border-brand-blue/40`}>
      Upcoming
    </span>
  );
}

export function InstallmentsTable({
  installments,
  loanStatus,
  isPaying,
  onPay,
}: InstallmentsTableProps) {
  const nextId = installments.find((i) => !i.paidAt)?.id;

  return (
    <section aria-labelledby="schedule-heading" className="space-y-4">
      <SectionHeader
        icon={Receipt}
        title="Amortization Schedule"
        actions={
          <span className="text-xs font-mono font-bold text-brand-blue/70">
            Reducing Balance Calculations
          </span>
        }
      />
      <h3 id="schedule-heading" className="sr-only">
        Installment schedule
      </h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Total EMI</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((inst) => {
            const totalDue = inst.principalDue + inst.interestDue;
            const isNext = nextId === inst.id;
            const isActive = loanStatus === 'active';

            return (
              <TableRow
                key={inst.id}
                className={isNext ? 'bg-brand-pink-tint/60 border-l-4 border-l-brand-pink' : ''}
              >
                <TableCell className="font-mono font-bold">{inst.sequence}</TableCell>
                <TableCell className="font-mono font-bold">{formatDate(inst.dueDate)}</TableCell>
                <TableCell><Money cents={inst.principalDue} /></TableCell>
                <TableCell><Money cents={inst.interestDue} /></TableCell>
                <TableCell className="font-bold text-brand-blue"><Money cents={totalDue} /></TableCell>
                <TableCell>
                  <InstallmentStatusPill installment={inst} isNext={isNext} />
                </TableCell>
                <TableCell className="text-right">
                  {isNext && isActive && !inst.paidAt && (
                    <PayInstallmentButton
                      isPending={isPaying}
                      amountCents={totalDue}
                      onPay={() => onPay(inst.sequence)}
                      size="xs"
                      variant="inline"
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
