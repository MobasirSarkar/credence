/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DecisionActionsProps {
  reason: string;
  onReasonChange: (s: string) => void;
  isSubmitting: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function DecisionActions({
  reason,
  onReasonChange,
  isSubmitting,
  onApprove,
  onReject,
}: DecisionActionsProps) {
  return (
    <section
      aria-labelledby="decision-heading"
      className="rounded-2xl border-2 border-brand-blue bg-brand-card p-6 riso-shadow-lg space-y-4"
    >
      <h3 id="decision-heading" className="font-extrabold text-lg text-brand-blue">
        Underwriter Action
      </h3>
      <Input
        placeholder="Reason / Admin Note (Optional for Approve, Required for Reject)"
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
      />
      <div className="flex gap-3">
        <Button disabled={isSubmitting} onClick={onApprove}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="size-4 stroke-3" aria-hidden="true" />
          )}
          Approve Application
        </Button>
        <Button variant="destructive" disabled={isSubmitting || !reason.trim()} onClick={onReject}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <X className="size-4 stroke-3" aria-hidden="true" />
          )}
          Reject Application
        </Button>
      </div>
    </section>
  );
}
