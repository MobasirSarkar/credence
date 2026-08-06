/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMemo, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { ArrowRight, Calculator, CheckCircle2, Wallet, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BrandLogo } from '@/components/BrandLogo';

const QUICK_BENEFITS = [
  'Instant Underwriting',
  'Fixed 12% - 15% APR',
  'Zero Hidden Fees',
] as const;

const TENURE_OPTIONS = [6, 12, 24, 36] as const;

const PILLARS = [
  {
    icon: Zap,
    iconBg: 'bg-brand-pink',
    iconShadow: 'shadow-[2.5px_2.5px_0px_var(--color-brand-blue)]',
    eyebrowClassName: 'text-brand-pink',
    eyebrow: 'PILLAR 01',
    title: 'Loan Origination System (LOS)',
    description:
      'From initial application form to rule-based underwriting decision. Calculates Debt-to-Income (FOIR) instantly to provide automated approval recommendations.',
    items: [
      'Instant FOIR (Fixed Obligation to Income Ratio) Evaluation',
      'Automated Pre-qualification Engine',
      'Underwriter Review Queue & One-click Disbursement',
    ],
    firstDot: 'bg-brand-pink',
  },
  {
    icon: Wallet,
    iconBg: 'bg-brand-blue',
    iconShadow: 'shadow-[2.5px_2.5px_0px_var(--color-brand-pink)]',
    eyebrowClassName: 'text-brand-blue',
    eyebrow: 'PILLAR 02',
    title: 'Loan Management System (LMS)',
    description:
      'Complete post-disbursement lifecycle management. Automated reducing-balance amortization schedules, EMI tracking, and single-click installment recording.',
    items: [
      'Reducing-Balance Amortization Engine',
      'Real-time Outstanding Principal Recalculation',
      'Instant Mock EMI Payment & Status Tracking',
    ],
    firstDot: 'bg-brand-pink',
  },
] as const;

const AMOUNT_MIN = 10000;
const AMOUNT_MAX = 500000;
const AMOUNT_STEP = 10000;
const MONTHLY_RATE = 0.01;

export function Landing() {
  const [calcAmount, setCalcAmount] = useState(100000);
  const [calcMonths, setCalcMonths] = useState(12);
  const { data } = useMe();

  const { emi, totalInterest, totalRepayment } = useMemo(() => {
    const e = Math.round(
      (calcAmount * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, calcMonths)) /
        (Math.pow(1 + MONTHLY_RATE, calcMonths) - 1),
    );
    return {
      emi: e,
      totalInterest: Math.max(0, e * calcMonths - calcAmount),
      totalRepayment: e * calcMonths,
    };
  }, [calcAmount, calcMonths]);

  const isLoggedIn = !!data?.user;

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-white">
      {/* Top Navbar */}
      <header className="border-b-2 border-brand-blue bg-brand-paper sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center group">
            <BrandLogo size="h-10" />
          </Link>

          <nav aria-label="Marketing sections" className="hidden md:flex items-center gap-8 text-sm font-bold">
            <a href="#features" className="hover:text-brand-pink transition-colors">Features</a>
            <a href="#calculator" className="hover:text-brand-pink transition-colors">Calculator</a>
            <a href="#process" className="hover:text-brand-pink transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-brand-pink transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button size="sm" render={<Link to="/dashboard" />}>
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold px-3 py-1.5 hover:text-brand-pink transition-colors">
                  Log in
                </Link>
                <Button size="sm" render={<Link to="/signup" />}>
                  Apply for Loan
                  <ArrowRight className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section aria-labelledby="hero-heading" className="mx-auto max-w-6xl px-6 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-brand-blue bg-brand-card px-3.5 py-1 text-xs font-mono font-bold text-brand-blue shadow-[2.5px_2.5px_0px_var(--color-brand-blue)] mb-6">
              <span aria-hidden="true" className="size-2 rounded-full bg-brand-pink animate-pulse" />
              Automated Loan Origination & Management
            </p>

            <h1
              id="hero-heading"
              className="text-4xl font-extrabold tracking-tight text-brand-blue sm:text-5xl lg:text-6xl leading-[1.08]"
            >
              Joyful, instant personal loans with{' '}
              <span className="underline decoration-brand-pink decoration-4 underline-offset-4">
                total transparency
              </span>
              .
            </h1>

            <p className="mt-6 text-lg text-brand-blue/85 leading-relaxed max-w-xl font-medium">
              We mix automated rule engines and zero-paperwork workflows on warm off-white digital paper — every loan, schedule, and instant EMI payment delivered with complete clarity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" className="text-base py-6 px-7" render={<Link to="/signup" />}>
                Apply in 2 minutes
                <ArrowRight className="size-5" />
              </Button>
              <a href="#calculator">
                <Button size="lg" variant="outline" className="text-base py-6 px-7">
                  <Calculator className="size-5 text-brand-pink" />
                  Calculate EMI
                </Button>
              </a>
            </div>

            <ul className="mt-10 pt-8 border-t-2 border-brand-blue/20 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full list-none">
              {QUICK_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-brand-pink shrink-0 stroke-[2.5]" />
                  <span className="text-xs font-bold text-brand-blue">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EMI Calculator */}
          <aside id="calculator" aria-label="EMI Calculator" className="lg:col-span-5">
            <Card className="relative riso-shadow-lg p-6 overflow-hidden">
              <span aria-hidden="true" className="absolute top-2 left-2 text-brand-blue/40 font-mono text-xs font-bold">┌</span>
              <span aria-hidden="true" className="absolute top-2 right-2 text-brand-blue/40 font-mono text-xs font-bold">┐</span>
              <span aria-hidden="true" className="absolute bottom-2 left-2 text-brand-blue/40 font-mono text-xs font-bold">└</span>
              <span aria-hidden="true" className="absolute bottom-2 right-2 text-brand-blue/40 font-mono text-xs font-bold">┘</span>

              <CardContent className="p-0 space-y-5">
                <header className="flex items-center justify-between border-b-2 border-brand-blue pb-4">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="size-3 rounded-full bg-brand-pink border border-brand-blue" />
                    <span aria-hidden="true" className="size-3 rounded-full bg-brand-blue" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-blue ml-1">
                      PRINT SPEC // EMI CALC
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-pink-tint text-brand-blue border border-brand-blue">
                    MISREGISTRATION #04
                  </span>
                </header>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="calc-amount" className="text-xs font-bold uppercase tracking-wider font-mono text-brand-blue">
                      Loan Amount (₹)
                    </label>
                    <span className="font-mono font-bold text-lg text-brand-blue">
                      ₹{calcAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    id="calc-amount"
                    type="range"
                    min={AMOUNT_MIN}
                    max={AMOUNT_MAX}
                    step={AMOUNT_STEP}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-2 bg-brand-pink-tint rounded-lg appearance-none cursor-pointer accent-brand-pink border border-brand-blue"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-brand-blue/70 mt-1 font-bold">
                    <span>₹{AMOUNT_MIN.toLocaleString('en-IN')}</span>
                    <span>₹{AMOUNT_MAX.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-brand-blue">
                      Tenure (Months)
                    </span>
                    <span className="font-mono font-bold text-lg text-brand-blue">
                      {calcMonths} Months
                    </span>
                  </div>
                  <div role="radiogroup" aria-label="Tenure in months" className="grid grid-cols-4 gap-2">
                    {TENURE_OPTIONS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={calcMonths === m}
                        onClick={() => setCalcMonths(m)}
                        className={`py-1.5 text-xs font-mono font-bold rounded-md border-2 border-brand-blue transition-all cursor-pointer ${
                          calcMonths === m
                            ? 'bg-brand-pink text-white shadow-[2px_2px_0px_var(--color-brand-blue)]'
                            : 'bg-brand-card text-brand-blue hover:bg-brand-pink-tint'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                <output
                  aria-live="polite"
                  className="block rounded-xl border-2 border-brand-blue bg-brand-pink-tint p-4 shadow-[3px_3px_0px_var(--color-brand-blue)]"
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
                  Apply for ₹{calcAmount.toLocaleString('en-IN')} Loan
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" aria-labelledby="features-heading" className="border-t-2 border-brand-blue bg-brand-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <header className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-pink-tint text-brand-blue border-2 border-brand-blue shadow-[2px_2px_0px_var(--color-brand-blue)]">
              DESIGNED FOR SIMPLICITY
            </span>
            <h2 id="features-heading" className="mt-4 text-3xl sm:text-4xl font-extrabold text-brand-blue">
              Two core pillars powering your loan journey
            </h2>
            <p className="mt-3 text-base text-brand-blue/80 font-medium">
              Loan Origination (LOS) handles instant application & automated approval. Loan Management (LMS) tracks payments & interest accrual.
            </p>
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 list-none">
            {PILLARS.map((p) => (
              <li key={p.title}>
                <PillarCard {...p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section aria-labelledby="cta-heading" className="bg-brand-blue text-white py-16 border-t-2 border-b-2 border-brand-blue relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-pink text-white border border-white mb-4">
            READY TO DEMO?
          </span>
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
            Experience the entire lending journey in under 2 minutes.
          </h2>
          <p className="mt-4 text-base text-white/80 max-w-xl mx-auto font-medium">
            Sign up as a new borrower or log in as our seeded admin to test the approval queue and loan disbursement flow live.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-brand-pink hover:bg-brand-pink/90 text-white border-2 border-white shadow-[3.5px_3.5px_0px_var(--color-white)]"
              render={<Link to="/signup" />}
            >
              Start Free Demo
              <ArrowRight className="size-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-brand-paper text-brand-blue border-2 border-white hover:bg-white"
              render={<Link to="/login" />}
            >
              Admin Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-paper py-10 border-t-2 border-brand-blue">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-brand-blue">
          <div className="flex items-center gap-3">
            <BrandLogo size="h-7" />
            <span>LMS Loan Origination & Management System</span>
          </div>
          <p>Built with React 19, Fastify, Drizzle ORM, SQLite & Riso Print Aesthetic.</p>
        </div>
      </footer>
    </main>
  );
}

type PillarCardProps = {
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconShadow: string;
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  description: string;
  items: readonly string[];
  firstDot: string;
};

function PillarCard({
  icon: Icon,
  iconBg,
  iconShadow,
  eyebrow,
  eyebrowClassName,
  title,
  description,
  items,
  firstDot,
}: PillarCardProps) {
  return (
    <article className="rounded-2xl border-2 border-brand-blue bg-brand-paper p-8 shadow-[5px_5px_0px_var(--color-brand-blue)] relative overflow-hidden group hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
      <header className="flex items-center gap-3 mb-4">
        <div
          className={`size-12 rounded-xl text-white border-2 border-brand-blue ${iconShadow} flex items-center justify-center font-bold ${iconBg}`}
        >
          <Icon className="size-6" />
        </div>
        <div>
          <p className={`text-xs font-mono font-bold uppercase tracking-wider ${eyebrowClassName}`}>
            {eyebrow}
          </p>
          <h3 className="text-2xl font-extrabold text-brand-blue">{title}</h3>
        </div>
      </header>
      <p className="text-sm text-brand-blue/85 font-medium leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2 text-xs font-mono font-bold text-brand-blue list-none">
        {items.map((item, idx) => (
          <li key={item} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${idx === 0 ? firstDot : 'bg-brand-blue'}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
