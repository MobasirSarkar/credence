/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  EMI_AMOUNT_MAX,
  EMI_AMOUNT_MIN,
  EMI_AMOUNT_STEP,
  EMI_TENURE_OPTIONS,
  type EmiCalculatorState,
} from '@/hooks/useEmiCalculator';

interface EmiCalculatorProps {
  calc: EmiCalculatorState;
}

const CORNER = 'absolute text-brand-blue/40 font-mono text-xs font-bold';

export function EmiCalculator({ calc }: EmiCalculatorProps) {
  const { amount, months, setAmount, setMonths, emi, totalInterest, totalRepayment } = calc;

  return (
    <aside id="calculator" aria-label="EMI Calculator" className="lg:col-span-5">
      <Card className="relative riso-shadow-lg p-6 overflow-hidden">
        <span aria-hidden="true" className={`${CORNER} top-2 left-2`}>┌</span>
        <span aria-hidden="true" className={`${CORNER} top-2 right-2`}>┐</span>
        <span aria-hidden="true" className={`${CORNER} bottom-2 left-2`}>└</span>
        <span aria-hidden="true" className={`${CORNER} bottom-2 right-2`}>┘</span>

        <CardContent className="p-0 space-y-5">
          <header className="flex items-center justify-between border-b-2 border-brand-blue pb-4">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-full bg-brand-pink border border-brand-blue" />
              <span aria-hidden="true" className="size-3 rounded-full bg-brand-blue" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-blue ml-1">
                Print Spec // EMI Calc
              </h3>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-pink-tint text-brand-blue border border-brand-blue">
              Misregistration #04
            </span>
          </header>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="calc-amount"
                className="text-xs font-bold uppercase tracking-wider font-mono text-brand-blue"
              >
                Loan Amount (₹)
              </label>
              <span className="font-mono font-bold text-lg text-brand-blue">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id="calc-amount"
              type="range"
              min={EMI_AMOUNT_MIN}
              max={EMI_AMOUNT_MAX}
              step={EMI_AMOUNT_STEP}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-brand-pink-tint rounded-lg appearance-none cursor-pointer accent-brand-pink border border-brand-blue"
            />
            <div className="flex justify-between text-[10px] font-mono text-brand-blue/70 mt-1 font-bold">
              <span>₹{EMI_AMOUNT_MIN.toLocaleString('en-IN')}</span>
              <span>₹{EMI_AMOUNT_MAX.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-brand-blue">
                Tenure (Months)
              </span>
              <span className="font-mono font-bold text-lg text-brand-blue">
                {months} Months
              </span>
            </div>
            <div role="radiogroup" aria-label="Tenure in months" className="grid grid-cols-4 gap-2">
              {EMI_TENURE_OPTIONS.map((m) => {
                const isActive = months === m;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setMonths(m)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-md border-2 border-brand-blue transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-pink text-primary-foreground riso-shadow-sm'
                        : 'bg-brand-card text-brand-blue hover:bg-brand-pink-tint'
                    }`}
                  >
                    {m}m
                  </button>
                );
              })}
            </div>
          </div>

          <output
            aria-live="polite"
            className="block rounded-xl border-2 border-brand-blue bg-brand-pink-tint p-4 riso-shadow"
          >
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-mono font-bold uppercase text-brand-blue">
                Estimated Monthly EMI
              </span>
              <span className="text-xs font-mono font-bold text-brand-pink">@ 12% APR</span>
            </div>
            <p className="text-3xl font-extrabold font-mono text-brand-blue">
              ₹{emi.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-brand-blue/70"> / month</span>
            </p>
            <dl className="mt-3 pt-3 border-t border-brand-blue/20 flex justify-between text-xs font-bold text-brand-blue">
              <div>
                <dt className="sr-only">Total Interest</dt>
                <dd>Total Interest: ₹{totalInterest.toLocaleString('en-IN')}</dd>
              </div>
              <div>
                <dt className="sr-only">Total Repayment</dt>
                <dd>Total Repayment: ₹{totalRepayment.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
          </output>

          <Button size="lg" className="w-full" render={<Link to="/signup" />}>
            Apply for ₹{amount.toLocaleString('en-IN')} Loan
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
