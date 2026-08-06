/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StepIndex } from './constants';

interface StepControlsProps {
  step: StepIndex;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function StepControls({ step, isSubmitting, onBack, onNext }: StepControlsProps) {
  const isLast = step === 2;
  return (
    <footer className="flex items-center justify-between pt-4 border-t-2 border-[#2C40A7]/20">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={step === 0}
        aria-label="Go to previous step"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </Button>

      {isLast ? (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Evaluating...
            </>
          ) : (
            <>
              Submit Loan Application
              <CheckCircle2 className="size-4 stroke-[2.5]" aria-hidden="true" />
            </>
          )}
        </Button>
      ) : (
        <Button type="button" onClick={onNext} aria-label="Go to next step">
          Next Step
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      )}
    </footer>
  );
}
