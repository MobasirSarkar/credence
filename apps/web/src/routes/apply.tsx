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
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CircleAlert, Loader2, Sparkles, Wallet, TrendingUp, Receipt } from 'lucide-react';

const TERMS = [
  { v: '6', l: '6 months' },
  { v: '12', l: '12 months' },
  { v: '24', l: '24 months' },
  { v: '36', l: '36 months' },
];
const RATES = [
  { v: '1000', l: '10%' },
  { v: '1200', l: '12%' },
  { v: '1500', l: '15%' },
  { v: '1800', l: '18%' },
  { v: '2000', l: '20%' },
  { v: '2400', l: '24%' },
];

const STEP_FIELDS: Array<keyof AppT>[] = [
  ['amount', 'termMonths', 'annualRateBps'],
  ['purpose', 'employment'],
  [],
];

const STEP_TITLES = ['Loan details', 'Purpose & employment', 'Review & submit'];

function emiPreview(amountCents: number, termMonths: number, annualRateBps: number): number {
  const principal = amountCents / 100;
  const monthlyRate = annualRateBps / 10_000 / 12;
  if (monthlyRate === 0) return Math.round(principal / termMonths);
  const r = monthlyRate;
  const n = termMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

export function Apply() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<null | { status: string; reason: string | null }>(null);
  const form = useForm<AppT>({
    resolver: zodResolver(ApplicationInput),
    mode: 'onTouched',
    defaultValues: { amount: 50_000_00, termMonths: 12, annualRateBps: 1500, purpose: '', employment: 'salaried' },
  });
  const create = useCreateApplication();
  const values = form.watch();
  const monthlyEmi = useMemo(
    () => emiPreview(values.amount, values.termMonths, values.annualRateBps),
    [values.amount, values.termMonths, values.annualRateBps]
  );

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const ok = await form.trigger(fields as Parameters<typeof form.trigger>[0]);
    if (ok) setStep((s) => Math.min(2, s + 1));
  }

  if (result) {
    const rejected = result.status === 'rejected';
    return (
      <main className="relative min-h-screen bg-background">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <header className="border-b">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Button variant="ghost" size="sm" render={<Link to="/dashboard" />}>
              <ArrowLeft />
              Dashboard
            </Button>
            <span className="text-sm text-muted-foreground">Step 3 of 3</span>
          </div>
        </header>
        <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center">
          <span
            className={
              'flex size-14 items-center justify-center rounded-full ' +
              (rejected ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')
            }
          >
            {rejected ? <CircleAlert className="size-7" /> : <Check className="size-7" />}
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            {rejected ? 'Application rejected' : 'Application submitted'}
          </h1>
          <p className="mt-2 text-balance text-sm text-muted-foreground">
            {rejected
              ? 'Your application did not meet the eligibility criteria. You can review the reason below or try a different amount and term.'
              : 'Your application is now pending review. We will notify you once an admin has decided.'}
          </p>
          {result.reason ? (
            <Card className="mt-6 w-full text-left">
              <CardContent className="p-4 text-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Decision reason</p>
                <p className="mt-1">{result.reason}</p>
              </CardContent>
            </Card>
          ) : null}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button render={<Link to="/dashboard" />}>
              View dashboard
              <ArrowRight />
            </Button>
            {!rejected ? (
              <Button variant="outline" onClick={() => { setResult(null); setStep(0); form.reset(); }}>
                Apply for another loan
              </Button>
            ) : (
              <Button variant="outline" onClick={() => { setResult(null); setStep(0); }}>
                Try again
              </Button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Button variant="ghost" size="sm" render={<Link to="/dashboard" />}>
            <ArrowLeft />
            Dashboard
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of 3 — {STEP_TITLES[step]}
          </span>
        </div>
        <div className="mx-auto h-1 max-w-3xl overflow-hidden bg-muted px-6">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={3}
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-3xl gap-6 px-6 py-8 lg:grid-cols-[1fr_240px]">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((v) =>
                  create.mutate(v, {
                    onSuccess: (data) =>
                      setResult({ status: data.application.status, reason: data.application.decisionReason }),
                    onError: (e) => toast.error((e as Error).message),
                  })
                )}
                className="space-y-5"
              >
                {step === 0 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1000}
                              step={500}
                              value={field.value / 100}
                              onChange={(e) => field.onChange(Math.round(Number(e.target.value) * 100))}
                            />
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
                          <FormLabel>Term</FormLabel>
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
                          <FormLabel>Interest rate</FormLabel>
                          <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RATES.map((t) => (
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
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Home renovation, Medical, Travel" {...field} />
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
                          <FormLabel>Employment</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="salaried">Salaried</SelectItem>
                              <SelectItem value="self_employed">Self-employed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-base font-semibold">Review your application</h2>
                    <dl className="divide-y rounded-lg border text-sm">
                      <ReviewRow label="Amount" value={`₹${(values.amount / 100).toLocaleString('en-IN')}`} />
                      <ReviewRow label="Term" value={`${values.termMonths} months`} />
                      <ReviewRow label="Interest rate" value={`${(values.annualRateBps / 100).toFixed(2)}%`} />
                      <ReviewRow label="Purpose" value={values.purpose} />
                      <ReviewRow label="Employment" value={values.employment === 'salaried' ? 'Salaried' : 'Self-employed'} />
                      <ReviewRow label="Estimated EMI" value={`₹${monthlyEmi.toLocaleString('en-IN')}`} bold />
                    </dl>
                    <p className="text-xs text-muted-foreground">
                      By submitting, you confirm the information is accurate. An admin will review your application.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                  >
                    <ArrowLeft />
                    Back
                  </Button>
                  {step < 2 ? (
                    <Button type="button" onClick={goNext}>
                      Next
                      <ArrowRight />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={create.isPending}>
                      {create.isPending ? <Loader2 className="animate-spin" /> : null}
                      {create.isPending ? 'Submitting' : 'Submit application'}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">What's happening</p>
              <SidebarItem
                icon={Wallet}
                title="You submit"
                body="Your application enters the review queue."
              />
              <SidebarItem
                icon={Sparkles}
                title="Admin reviews"
                body="An admin checks eligibility and decides."
              />
              <SidebarItem
                icon={Receipt}
                title="Disbursement"
                body="Approved loans are disbursed and a schedule is created."
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-1 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estimated EMI</p>
              <p className="text-2xl font-semibold tabular-nums">
                ₹{monthlyEmi.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-muted-foreground">
                For ₹{(values.amount / 100).toLocaleString('en-IN')} over {values.termMonths} months at{' '}
                {(values.annualRateBps / 100).toFixed(2)}% APR.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function ReviewRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={bold ? 'font-semibold tabular-nums' : 'tabular-nums'}>{value}</dd>
    </div>
  );
}

function SidebarItem({ icon: Icon, title, body }: { icon: typeof TrendingUp; title: string; body: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-3.5" />
      </span>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
