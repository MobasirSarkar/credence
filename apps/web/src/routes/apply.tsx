/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationInput, type ApplicationInput as AppT } from '@lms/shared';
import { useCreateApplication } from '@/hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, CircleAlert, Loader2, Sparkles, Wallet,
  TrendingUp, ShieldCheck, CheckCircle2, Calculator, RefreshCw
} from 'lucide-react';

const TERMS = [
  { v: '6', l: '6 months' },
  { v: '12', l: '12 months' },
  { v: '24', l: '24 months' },
  { v: '36', l: '36 months' },
];
const RATES = [
  { v: '1000', l: '10% APR' },
  { v: '1200', l: '12% APR' },
  { v: '1500', l: '15% APR' },
  { v: '1800', l: '18% APR' },
  { v: '2000', l: '20% APR' },
  { v: '2400', l: '24% APR' },
];

const STEP_FIELDS: Array<keyof AppT>[] = [
  ['amount', 'termMonths', 'annualRateBps'],
  ['purpose', 'employment'],
  [],
];

const STEP_TITLES = ['Loan Details', 'Purpose & Employment', 'Review & Submit'];

function calculateEmiCents(amountCents: number, termMonths: number, annualRateBps: number): number {
  if (!amountCents || !termMonths) return 0;
  const r = annualRateBps / 10000 / 12;
  if (r === 0) return Math.round(amountCents / termMonths);
  const pow = Math.pow(1 + r, termMonths);
  return Math.round((amountCents * r * pow) / (pow - 1));
}

export function Apply() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<null | { status: string; reason: string | null }>(null);
  const nav = useNavigate();

  const form = useForm<AppT>({
    resolver: zodResolver(ApplicationInput),
    defaultValues: {
      amount: 5000000, // ₹50,000 in cents
      termMonths: 12,
      annualRateBps: 1500,
      purpose: 'Home renovation',
      employment: 'salaried',
    },
  });

  const create = useCreateApplication();

  const currentAmount = form.watch('amount') || 0;
  const currentTerm = form.watch('termMonths') || 12;
  const currentRate = form.watch('annualRateBps') || 1500;

  const estimatedEmiCents = useMemo(
    () => calculateEmiCents(currentAmount, currentTerm, currentRate),
    [currentAmount, currentTerm, currentRate]
  );

  const totalRepaymentCents = estimatedEmiCents * currentTerm;
  const totalInterestCents = Math.max(0, totalRepaymentCents - currentAmount);

  // Result Screen (Approved / Pending / Rejected)
  if (result) {
    const isApprovedOrPending = result.status === 'approved' || result.status === 'pending';
    return (
      <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans p-6 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-8 shadow-[6px_6px_0px_#2C40A7] text-center space-y-6 relative">
          
          <div className="flex justify-center">
            <div className={`size-16 rounded-2xl border-2 border-[#2C40A7] flex items-center justify-center shadow-[3px_3px_0px_#2C40A7] ${
              isApprovedOrPending ? 'bg-[#F237A1] text-white' : 'bg-[#DC2626] text-white'
            }`}>
              {isApprovedOrPending ? <Check className="size-8 stroke-[3]" /> : <CircleAlert className="size-8 stroke-[3]" />}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2C40A7]/70 block mb-1">
              APPLICATION STATUS RESULT
            </span>
            <h1 className="text-3xl font-extrabold text-[#2C40A7]">
              Application {result.status.toUpperCase()}
            </h1>
            <p className="mt-2 text-sm text-[#2C40A7]/80 font-medium">
              {isApprovedOrPending
                ? 'Your loan application has passed initial checks and is ready in your dashboard.'
                : (result.reason ?? 'Your application did not meet underwriting income criteria.')}
            </p>
          </div>

          {result.reason && !isApprovedOrPending && (
            <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FDE8F3] p-4 text-left font-mono text-xs font-bold text-[#2C40A7]">
              <span className="text-[#F237A1] block mb-0.5">UNDERWRITING REASON:</span>
              {result.reason}
            </div>
          )}

          <div className="pt-4 border-t-2 border-[#2C40A7]/20 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => nav('/dashboard')}>
              Go to Dashboard
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setResult(null);
                setStep(0);
                form.reset();
              }}
            >
              <RefreshCw className="size-4 text-[#F237A1]" />
              New Application
            </Button>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans selection:bg-[#F237A1] selection:text-white pb-20">
      
      {/* Top Bar Navigation */}
      <header className="border-b-2 border-[#2C40A7] bg-[#FAF7F0] sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold hover:text-[#F237A1] transition-colors">
            <ArrowLeft className="size-4 stroke-[2.5]" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded bg-[#F237A1] text-white text-xs font-bold border border-[#2C40A7]">
              LM
            </span>
            <span className="font-extrabold text-base">Loan Wizard</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-6 pt-8 space-y-8">
        
        {/* Step Indicator Bar */}
        <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-4 shadow-[3.5px_3.5px_0px_#2C40A7] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#2C40A7] text-white font-mono font-bold text-sm">
              {step + 1}
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block">
                STEP {step + 1} OF 3
              </span>
              <h2 className="text-lg font-extrabold text-[#2C40A7]">{STEP_TITLES[step]}</h2>
            </div>
          </div>

          {/* Step Pills */}
          <div className="flex items-center gap-2">
            {STEP_TITLES.map((title, idx) => (
              <div
                key={title}
                className={`h-2.5 rounded-full transition-all border border-[#2C40A7] ${
                  idx === step
                    ? 'w-10 bg-[#F237A1]'
                    : idx < step
                    ? 'w-6 bg-[#2C40A7]'
                    : 'w-6 bg-[#FDE8F3]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2-Column Grid (Form + Live EMI Summary Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Multi-step Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-6 sm:p-8 shadow-[5px_5px_0px_#2C40A7]">
              
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) =>
                    create.mutate(v, {
                      onSuccess: (data) =>
                        setResult({
                          status: data.application.status,
                          reason: data.application.decisionReason,
                        }),
                      onError: (e) => toast.error((e as Error).message),
                    })
                  )}
                  className="space-y-6"
                >

                  {/* Step 1: Loan Amount, Tenure, Rate */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">
                              Loan Amount (₹)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[#2C40A7]">₹</span>
                                <Input
                                  type="number"
                                  className="pl-7 font-mono font-bold text-base"
                                  value={field.value ? field.value / 100 : ''}
                                  onChange={(e) => field.onChange(Math.round(Number(e.target.value) * 100))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="termMonths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">
                              Tenure (Months)
                            </FormLabel>
                            <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TERMS.map((t) => (
                                  <SelectItem key={t.v} value={t.v}>
                                    {t.l}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="annualRateBps"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">
                              Interest Rate (APR)
                            </FormLabel>
                            <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {RATES.map((r) => (
                                  <SelectItem key={r.v} value={r.v}>
                                    {r.l}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Purpose & Employment */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">
                              Loan Purpose
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Home renovation, Medical expense..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">
                              Employment Status
                            </FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="salaried">Salaried Employee</SelectItem>
                                <SelectItem value="self_employed">Self-Employed / Business Owner</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Review & Final Confirmation */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FAF7F0] p-4 space-y-3 font-mono text-xs font-bold text-[#2C40A7]">
                        <div className="flex justify-between py-1 border-b border-[#2C40A7]/20">
                          <span className="text-[#2C40A7]/70">REQUESTED AMOUNT:</span>
                          <span className="text-sm text-[#F237A1]">₹{(currentAmount / 100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#2C40A7]/20">
                          <span className="text-[#2C40A7]/70">TENURE:</span>
                          <span>{currentTerm} Months</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#2C40A7]/20">
                          <span className="text-[#2C40A7]/70">INTEREST RATE:</span>
                          <span>{(currentRate / 100).toFixed(2)}% APR</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#2C40A7]/20">
                          <span className="text-[#2C40A7]/70">PURPOSE:</span>
                          <span className="capitalize">{form.getValues('purpose')}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#2C40A7]/70">EMPLOYMENT:</span>
                          <span className="capitalize">{form.getValues('employment')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wizard Step Controls */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-[#2C40A7]/20">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </Button>

                    {step < 2 ? (
                      <Button
                        type="button"
                        onClick={async () => {
                          const ok = await form.trigger(STEP_FIELDS[step]);
                          if (ok) setStep((s) => s + 1);
                        }}
                      >
                        Next Step
                        <ArrowRight className="size-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={create.isPending}>
                        {create.isPending ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            Submit Loan Application
                            <CheckCircle2 className="size-4 stroke-[2.5]" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                </form>
              </Form>

            </div>
          </div>

          {/* Right Column: Live Riso EMI Calculator Box */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FDE8F3] p-6 shadow-[5px_5px_0px_#2C40A7] space-y-5 sticky top-24">
              <div className="flex items-center gap-2 border-b-2 border-[#2C40A7] pb-3">
                <Calculator className="size-5 text-[#F237A1]" />
                <h3 className="font-extrabold text-base text-[#2C40A7]">Live Loan Estimate</h3>
              </div>

              <div className="space-y-3 font-mono text-xs font-bold text-[#2C40A7]">
                <div className="bg-[#FFFDF8] p-4 rounded-xl border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]">
                  <span className="text-[10px] text-[#2C40A7]/70 uppercase block mb-1">
                    ESTIMATED MONTHLY EMI
                  </span>
                  <div className="text-3xl font-extrabold text-[#F237A1]">
                    ₹{(estimatedEmiCents / 100).toLocaleString('en-IN')}<span className="text-xs font-normal text-[#2C40A7]/70"> / mo</span>
                  </div>
                </div>

                <div className="bg-[#FFFDF8] p-3 rounded-lg border border-[#2C40A7]/40 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#2C40A7]/70">Principal:</span>
                    <span>₹{(currentAmount / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2C40A7]/70">Est. Total Interest:</span>
                    <span>₹{(totalInterestCents / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#2C40A7]/20 text-[#2C40A7]">
                    <span>Est. Total Payable:</span>
                    <span>₹{(totalRepaymentCents / 100).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#2C40A7]">
                <ShieldCheck className="size-4 text-[#F237A1] shrink-0" />
                <span>Instant rule-based underwriting on submission</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
