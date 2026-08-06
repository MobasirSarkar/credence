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
import { EMPLOYMENT_OPTIONS } from './constants';

interface StepPurposeProps {
  form: UseFormReturn<ApplicationInput>;
}

const FIELD_LABEL_CLS = 'text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]';

export function StepPurpose({ form }: StepPurposeProps) {
  return (
    <fieldset className="space-y-5 border-0 p-0 m-0">
      <legend className="sr-only">Loan purpose and employment status</legend>

      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={FIELD_LABEL_CLS}>Loan Purpose</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Home renovation, Medical expense..."
                {...field}
              />
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
            <FormLabel className={FIELD_LABEL_CLS}>Employment Status</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EMPLOYMENT_OPTIONS.map((o) => (
                  <SelectItem key={o.v} value={o.v}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
}
