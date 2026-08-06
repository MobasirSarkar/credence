/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisbursementActionsProps {
  isSubmitting: boolean;
  onDisburse: () => void;
}

export function DisbursementActions({ isSubmitting, onDisburse }: DisbursementActionsProps) {
  return (
    <section
      aria-labelledby="disburse-heading"
      className="rounded-2xl border-2 border-brand-blue bg-brand-card p-6 riso-shadow-lg space-y-4"
    >
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-6 text-brand-pink" aria-hidden="true" />
        <div>
          <h3 id="disburse-heading" className="font-extrabold text-lg text-brand-blue">
            Ready for Disbursement
          </h3>
          <p className="text-xs font-medium text-brand-blue/80">
            Disbursing generates the amortization schedule and creates the active loan.
          </p>
        </div>
      </div>
      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
        onClick={onDisburse}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Generating Schedule…
          </>
        ) : (
          <>
            Disburse Loan &amp; Generate Amortization Schedule
            <ArrowRight className="size-5" aria-hidden="true" />
          </>
        )}
      </Button>
    </section>
  );
}
