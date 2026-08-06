/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMemo, useState } from 'react';

export const EMI_AMOUNT_MIN = 10000;
export const EMI_AMOUNT_MAX = 500000;
export const EMI_AMOUNT_STEP = 10000;
export const EMI_DEFAULT_RATE = 0.01; // 12% APR monthly
export const EMI_TENURE_OPTIONS = [6, 12, 24, 36] as const;

export interface EmiCalculatorState {
  amount: number;
  months: number;
  setAmount: (n: number) => void;
  setMonths: (n: number) => void;
  emi: number;
  totalInterest: number;
  totalRepayment: number;
}

/**
 * Owns the EMI calculator state and the amortization math.
 * Shared between the landing page calculator and any other surface
 * that wants to preview monthly payments.
 */
export function useEmiCalculator(
  initialAmount = 100000,
  initialMonths = 12,
): EmiCalculatorState {
  const [amount, setAmount] = useState(initialAmount);
  const [months, setMonths] = useState(initialMonths);

  const { emi, totalInterest, totalRepayment } = useMemo(() => {
    const e = Math.round(
      (amount * EMI_DEFAULT_RATE * Math.pow(1 + EMI_DEFAULT_RATE, months)) /
        (Math.pow(1 + EMI_DEFAULT_RATE, months) - 1),
    );
    return {
      emi: e,
      totalInterest: Math.max(0, e * months - amount),
      totalRepayment: e * months,
    };
  }, [amount, months]);

  return {
    amount,
    months,
    setAmount,
    setMonths,
    emi,
    totalInterest,
    totalRepayment,
  };
}
