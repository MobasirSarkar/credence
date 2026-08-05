/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { addMonths, format, isValid, parseISO } from 'date-fns';
import { roundCents } from '../lib/money.js';

export interface ScheduleRow {
  sequence: number;
  dueDate: string; // yyyy-mm-dd
  principalDue: number;
  interestDue: number;
}

export function calculateEmi(
  principalCents: number,
  annualRateBps: number,
  termMonths: number
): number {
  const r = annualRateBps / 10000 / 12;
  if (r === 0) return roundCents(principalCents / termMonths);
  const pow = Math.pow(1 + r, termMonths);
  return roundCents((principalCents * r * pow) / (pow - 1));
}

export function generateSchedule(
  principalCents: number,
  annualRateBps: number,
  termMonths: number,
  startDate: string
): ScheduleRow[] {
  const start = parseISO(startDate);
  if (!isValid(start)) throw new Error(`invalid startDate: ${startDate}`);
  const r = annualRateBps / 10000 / 12;
  const emi = calculateEmi(principalCents, annualRateBps, termMonths);
  const rows: ScheduleRow[] = [];
  let outstanding = principalCents;
  for (let i = 1; i <= termMonths; i++) {
    const interest = roundCents(outstanding * r);
    const principal = i === termMonths ? outstanding : emi - interest;
    rows.push({
      sequence: i,
      dueDate: format(addMonths(start, i), 'yyyy-MM-dd'),
      principalDue: principal,
      interestDue: interest,
    });
    outstanding -= principal;
  }
  return rows;
}
