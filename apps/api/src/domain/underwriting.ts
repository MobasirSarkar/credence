/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { calculateEmi } from './amortization.js';

export interface UnderwritingResult {
  recommendation: 'approve' | 'reject';
  reason?: string;
}

export function evaluate(
  monthlyIncomeCents: number,
  principalCents: number,
  annualRateBps: number,
  termMonths: number
): UnderwritingResult {
  if (monthlyIncomeCents <= 0) {
    return { recommendation: 'reject', reason: 'Income not provided' };
  }
  const emi = calculateEmi(principalCents, annualRateBps, termMonths);
  if (emi / monthlyIncomeCents > 0.5) {
    return { recommendation: 'reject', reason: 'EMI exceeds 50% of income' };
  }
  if (monthlyIncomeCents < 3 * emi) {
    return { recommendation: 'reject', reason: 'Income insufficient for requested EMI' };
  }
  return { recommendation: 'approve' };
}
