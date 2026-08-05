/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useState } from 'react';
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
import { Link } from 'react-router-dom';

const TERMS = [{ v: '6', l: '6 months' }, { v: '12', l: '12 months' }, { v: '24', l: '24 months' }, { v: '36', l: '36 months' }];
const RATES = [{ v: '1000', l: '10%' }, { v: '1200', l: '12%' }, { v: '1500', l: '15%' }, { v: '1800', l: '18%' }, { v: '2000', l: '20%' }, { v: '2400', l: '24%' }];

export function Apply() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<null | { status: string; reason: string | null }>(null);
  const form = useForm<AppT>({
    resolver: zodResolver(ApplicationInput),
    defaultValues: { amount: 50_000_00, termMonths: 12, annualRateBps: 1500, purpose: '', employment: 'salaried' },
  });
  const create = useCreateApplication();

  if (result) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader><CardTitle>Application {result.status}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {result.reason && <p className="text-sm">Reason: {result.reason}</p>}
            {result.status === 'rejected'
              ? <Button render={<Link to="/dashboard" />}>Back to dashboard</Button>
              : <Button render={<Link to="/dashboard" />}>View dashboard</Button>}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted">
      <Card className="max-w-md w-full">
        <CardHeader><CardTitle>Apply for a loan — Step {step + 1} of 3</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => create.mutate(v, {
              onSuccess: (data) => setResult({ status: data.application.status, reason: data.application.decisionReason }),
              onError: (e) => toast.error((e as Error).message),
            }))} className="space-y-3">
              {step === 0 && (
                <>
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem><FormLabel>Amount (₹)</FormLabel><FormControl><Input type="number" value={field.value / 100} onChange={(e) => field.onChange(Math.round(Number(e.target.value) * 100))} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="termMonths" render={({ field }) => (
                    <FormItem><FormLabel>Term</FormLabel>
                      <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{TERMS.map(t => <SelectItem key={t.v} value={t.v}>{t.l}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="annualRateBps" render={({ field }) => (
                    <FormItem><FormLabel>Interest rate</FormLabel>
                      <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{RATES.map(t => <SelectItem key={t.v} value={t.v}>{t.l}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                </>
              )}
              {step === 1 && (
                <>
                  <FormField control={form.control} name="purpose" render={({ field }) => (
                    <FormItem><FormLabel>Purpose</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="employment" render={({ field }) => (
                    <FormItem><FormLabel>Employment</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="self_employed">Self-employed</SelectItem>
                        </SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                </>
              )}
              {step === 2 && (
                <div className="text-sm space-y-1">
                  <p>Amount: ₹{(form.getValues('amount') / 100).toLocaleString('en-IN')}</p>
                  <p>Term: {form.getValues('termMonths')} months</p>
                  <p>Rate: {(form.getValues('annualRateBps') / 100).toFixed(2)}%</p>
                  <p>Purpose: {form.getValues('purpose')}</p>
                  <p>Employment: {form.getValues('employment')}</p>
                </div>
              )}
              <div className="flex gap-2 justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
                {step < 2
                  ? <Button type="button" onClick={async () => { const ok = await form.trigger(); if (ok) setStep((s) => s + 1); }}>Next</Button>
                  : <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Submitting…' : 'Submit application'}</Button>}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
