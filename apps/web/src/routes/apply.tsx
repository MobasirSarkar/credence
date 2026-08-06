/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationInput, type ApplicationInput as AppT } from '@lms/shared';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useCreateApplication } from '@/hooks/useApplications';
import { calculateEmiCents } from '@/components/apply/finance';
import { STEP_FIELDS, type StepIndex } from '@/components/apply/constants';
import { ApplyHeader } from '@/components/apply/ApplyHeader';
import { StepIndicator } from '@/components/apply/StepIndicator';
import { StepLoanDetails } from '@/components/apply/StepLoanDetails';
import { StepPurpose } from '@/components/apply/StepPurpose';
import { StepReview } from '@/components/apply/StepReview';
import { StepControls } from '@/components/apply/StepControls';
import { EmiSummary } from '@/components/apply/EmiSummary';
import { ResultScreen, type ApplyResult } from '@/components/apply/ResultScreen';

const FORM_DEFAULTS: AppT = {
  amount: 5000000, // ₹50,000 in cents
  termMonths: 12,
  annualRateBps: 1500,
  purpose: 'Home renovation',
  employment: 'salaried',
};

export function Apply() {
  const [step, setStep] = useState<StepIndex>(0);
  const [result, setResult] = useState<ApplyResult | null>(null);
  const nav = useNavigate();

  const form = useForm<AppT>({
    resolver: zodResolver(ApplicationInput),
    defaultValues: FORM_DEFAULTS,
  });
  const create = useCreateApplication();

  const values = form.watch();
  const emiCents = useMemo(
    () => calculateEmiCents(values.amount, values.termMonths, values.annualRateBps),
    [values.amount, values.termMonths, values.annualRateBps],
  );
  const totalRepaymentCents = emiCents * values.termMonths;
  const totalInterestCents = Math.max(0, totalRepaymentCents - values.amount);

  const onBack = () => setStep((s) => (s > 0 ? ((s - 1) as StepIndex) : 0));
  const onNext = async () => {
    const ok = await form.trigger(STEP_FIELDS[step] as never);
    if (ok) setStep((s) => (s < 2 ? ((s + 1) as StepIndex) : s));
  };
  const onSubmit = form.handleSubmit(
    (v) =>
      create.mutate(v, {
        onSuccess: ({ application }) =>
          setResult({ status: application.status, reason: application.decisionReason }),
        onError: (e) => toast.error((e as Error).message),
      }),
  );

  if (result) {
    return (
      <ResultScreen
        result={result}
        onGoToDashboard={() => nav('/dashboard')}
        onStartNew={() => {
          setResult(null);
          setStep(0);
          form.reset();
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-primary-foreground pb-20">
      <ApplyHeader />

      <div className="mx-auto max-w-6xl px-6 pt-8 space-y-8">
        <StepIndicator step={step} />

        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            noValidate
          >
            <section
              aria-labelledby="form-heading"
              className="lg:col-span-7 rounded-2xl border-2 border-brand-blue bg-brand-card p-6 sm:p-8 riso-shadow-lg space-y-6"
            >
              <h2 id="form-heading" className="sr-only">
                Loan application form
              </h2>

              {step === 0 && <StepLoanDetails form={form} />}
              {step === 1 && <StepPurpose form={form} />}
              {step === 2 && <StepReview values={values} />}

              <StepControls
                step={step}
                isSubmitting={create.isPending}
                onBack={onBack}
                onNext={onNext}
              />
            </section>

            <EmiSummary
              principalCents={values.amount}
              emiCents={emiCents}
              totalInterestCents={totalInterestCents}
              totalRepaymentCents={totalRepaymentCents}
            />
          </form>
        </Form>
      </div>
    </main>
  );
}
