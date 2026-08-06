/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/Money';

interface PayInstallmentButtonProps {
  isPending: boolean;
  amountCents: number;
  onPay: () => void;
  /** "lg" for the hero CTA, "xs" for the inline row action. */
  size?: 'lg' | 'xs';
  /** Render a label like "Pay Next EMI" vs "Pay EMI". */
  variant: 'next' | 'inline';
}

export function PayInstallmentButton({
  isPending,
  amountCents,
  onPay,
  size = 'lg',
  variant,
}: PayInstallmentButtonProps) {
  if (variant === 'inline') {
    return (
      <Button size="xs" disabled={isPending} onClick={onPay} aria-label="Pay this installment">
        {isPending ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : 'Pay EMI'}
      </Button>
    );
  }

  return (
    <Button size="lg" disabled={isPending} onClick={onPay}>
      {isPending ? (
        <>
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          Processing Payment...
        </>
      ) : (
        <>
          Pay Next EMI (<Money cents={amountCents} />)
          <ArrowLeft className="size-4 rotate-180" aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
