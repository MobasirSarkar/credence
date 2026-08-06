/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { ApplicationInput } from '@lms/shared';

export const TERMS = [
  { v: '6', months: 6, label: '6 months' },
  { v: '12', months: 12, label: '12 months' },
  { v: '24', months: 24, label: '24 months' },
  { v: '36', months: 36, label: '36 months' },
] as const;

export const RATES = [
  { v: '1000', bps: 1000, label: '10% APR' },
  { v: '1200', bps: 1200, label: '12% APR' },
  { v: '1500', bps: 1500, label: '15% APR' },
  { v: '1800', bps: 1800, label: '18% APR' },
  { v: '2000', bps: 2000, label: '20% APR' },
  { v: '2400', bps: 2400, label: '24% APR' },
] as const;

export const EMPLOYMENT_OPTIONS = [
  { v: 'salaried', label: 'Salaried Employee' },
  { v: 'self_employed', label: 'Self-Employed / Business Owner' },
] as const;

export const STEP_TITLES = [
  'Loan Details',
  'Purpose & Employment',
  'Review & Submit',
] as const;

export type StepIndex = 0 | 1 | 2;

export const STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof ApplicationInput>> = [
  ['amount', 'termMonths', 'annualRateBps'],
  ['purpose', 'employment'],
  [],
];

export const STEP_COUNT = STEP_TITLES.length;
