/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

/**
 * Equated Monthly Installment (EMI) in cents using the standard amortization formula.
 * `annualRateBps` is the annual rate in basis points (1bp = 0.01%).
 *
 * Named because the formula and unit conversion are not obvious at the call site.
 */
export function calculateEmiCents(
  amountCents: number,
  termMonths: number,
  annualRateBps: number,
): number {
  if (!amountCents || !termMonths) return 0;
  const r = annualRateBps / 10000 / 12;
  if (r === 0) return Math.round(amountCents / termMonths);
  const pow = Math.pow(1 + r, termMonths);
  return Math.round((amountCents * r * pow) / (pow - 1));
}
