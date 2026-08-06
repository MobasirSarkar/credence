/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import type { ApplicationInput } from '@lms/shared';
import { RATES, TERMS } from './constants';

interface StepLoanDetailsProps {
  form: UseFormReturn<ApplicationInput>;
}

const FIELD_LABEL_CLS = 'text-xs font-mono font-bold uppercase tracking-wider text-brand-blue';

export function StepLoanDetails({ form }: StepLoanDetailsProps) {
  return (
    <fieldset className="space-y-5 border-0 p-0 m-0">
      <legend className="sr-only">Loan amount, tenure, and interest rate</legend>

      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={FIELD_LABEL_CLS}>Loan Amount (₹)</FormLabel>
            <FormControl>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-brand-blue"
                >
                  ₹
                </span>
                <Input
                  type="number"
                  inputMode="numeric"
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
            <FormLabel className={FIELD_LABEL_CLS}>Tenure (Months)</FormLabel>
            <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TERMS.map((t) => (
                  <SelectItem key={t.months} value={t.v}>
                    {t.label}
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
        render={({ field }) => {
          const selected = RATES.find((r) => r.bps === field.value);
          return (
            <FormItem>
              <FormLabel className={FIELD_LABEL_CLS}>Interest Rate (APR)</FormLabel>
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selected?.label ?? 'Select rate'}>
                      {selected?.label}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RATES.map((r) => (
                    <SelectItem key={r.bps} value={r.v}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </fieldset>
  );
}
