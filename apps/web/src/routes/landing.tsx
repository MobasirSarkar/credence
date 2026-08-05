/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Wallet, ShieldCheck, Zap, Calculator, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Landing() {
  const [calcAmount, setCalcAmount] = useState(100000);
  const [calcMonths, setCalcMonths] = useState(12);

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1) where r = 12% / 12 = 0.01
  const monthlyRate = 0.01;
  const emi = Math.round(
    (calcAmount * monthlyRate * Math.pow(1 + monthlyRate, calcMonths)) /
    (Math.pow(1 + monthlyRate, calcMonths) - 1)
  );

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans selection:bg-[#F237A1] selection:text-white">
      {/* Top Navbar */}
      <header className="border-b-2 border-[#2C40A7] bg-[#FAF7F0] sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#F237A1] text-white border-2 border-[#2C40A7] shadow-[2.5px_2.5px_0px_#2C40A7] font-extrabold text-lg">
              LM
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-xl tracking-tight text-[#2C40A7]">
                LMS<span className="text-[#F237A1]">.</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2C40A7]/70 -mt-1 font-bold">
                Lending Studio
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <a href="#features" className="hover:text-[#F237A1] transition-colors">Features</a>
            <a href="#calculator" className="hover:text-[#F237A1] transition-colors">Calculator</a>
            <a href="#process" className="hover:text-[#F237A1] transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-[#F237A1] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold px-3 py-1.5 hover:text-[#F237A1] transition-colors">
              Log in
            </Link>
            <Button size="sm" render={<Link to="/signup" />}>
              Apply for Loan
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#2C40A7] bg-[#FFFDF8] px-3.5 py-1 text-xs font-mono font-bold text-[#2C40A7] shadow-[2.5px_2.5px_0px_#2C40A7] mb-6">
              <span className="size-2 rounded-full bg-[#F237A1] animate-pulse" />
              Automated Loan Origination & Management
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[#2C40A7] sm:text-5xl lg:text-6xl leading-[1.08]">
              Joyful, instant personal loans with <span className="underline decoration-[#F237A1] decoration-4 underline-offset-4">total transparency</span>.
            </h1>

            <p className="mt-6 text-lg text-[#2C40A7]/85 leading-relaxed max-w-xl font-medium">
              We mix automated rule engines and zero-paperwork workflows on warm off-white digital paper — every loan, schedule, and instant EMI payment delivered with complete clarity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" className="text-base py-6 px-7" render={<Link to="/signup" />}>
                Apply in 2 minutes
                <ArrowRight className="size-5" />
              </Button>
              <a href="#calculator">
                <Button size="lg" variant="outline" className="text-base py-6 px-7">
                  <Calculator className="size-5 text-[#F237A1]" />
                  Calculate EMI
                </Button>
              </a>
            </div>

            {/* Quick Benefits Badges */}
            <div className="mt-10 pt-8 border-t-2 border-[#2C40A7]/20 grid grid-cols-3 gap-4 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[#F237A1] shrink-0 stroke-[2.5]" />
                <span className="text-xs font-bold text-[#2C40A7]">Instant Underwriting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[#F237A1] shrink-0 stroke-[2.5]" />
                <span className="text-xs font-bold text-[#2C40A7]">Fixed 12% - 15% APR</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[#F237A1] shrink-0 stroke-[2.5]" />
                <span className="text-xs font-bold text-[#2C40A7]">Zero Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Riso Calculator Print Preview (Matching Image #2 style) */}
          <div id="calculator" className="lg:col-span-5">
            <div className="relative rounded-2xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-6 shadow-[6px_6px_0px_#2C40A7] overflow-hidden">
              
              {/* Risograph Print Corner Crop Marks */}
              <span className="absolute top-2 left-2 text-[#2C40A7]/40 font-mono text-xs font-bold">┌</span>
              <span className="absolute top-2 right-2 text-[#2C40A7]/40 font-mono text-xs font-bold">┐</span>
              <span className="absolute bottom-2 left-2 text-[#2C40A7]/40 font-mono text-xs font-bold">└</span>
              <span className="absolute bottom-2 right-2 text-[#2C40A7]/40 font-mono text-xs font-bold">┘</span>

              <div className="flex items-center justify-between border-b-2 border-[#2C40A7] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#F237A1] border border-[#2C40A7]" />
                  <span className="size-3 rounded-full bg-[#2C40A7]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#2C40A7] ml-1">
                    PRINT SPEC // EMI CALC
                  </h3>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FDE8F3] text-[#2C40A7] border border-[#2C40A7]">
                  MISREGISTRATION #04
                </span>
              </div>

              {/* Calculator Inputs */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider font-mono text-[#2C40A7]">
                      Loan Amount (₹)
                    </label>
                    <span className="font-mono font-bold text-lg text-[#2C40A7]">
                      ₹{calcAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-2 bg-[#FDE8F3] rounded-lg appearance-none cursor-pointer accent-[#F237A1] border border-[#2C40A7]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#2C40A7]/70 mt-1 font-bold">
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider font-mono text-[#2C40A7]">
                      Tenure (Months)
                    </label>
                    <span className="font-mono font-bold text-lg text-[#2C40A7]">
                      {calcMonths} Months
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 24, 36].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCalcMonths(m)}
                        className={`py-1.5 text-xs font-mono font-bold rounded-md border-2 border-[#2C40A7] transition-all cursor-pointer ${
                          calcMonths === m
                            ? 'bg-[#F237A1] text-white shadow-[2px_2px_0px_#2C40A7]'
                            : 'bg-[#FFFDF8] text-[#2C40A7] hover:bg-[#FDE8F3]'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FDE8F3] p-4 shadow-[3px_3px_0px_#2C40A7]">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-mono font-bold uppercase text-[#2C40A7]">
                      Estimated Monthly EMI
                    </span>
                    <span className="text-xs font-mono font-bold text-[#F237A1]">
                      @ 12% APR
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-[#2C40A7]">
                    ₹{emi.toLocaleString('en-IN')}<span className="text-xs font-normal text-[#2C40A7]/70"> / month</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#2C40A7]/20 flex justify-between text-xs font-bold text-[#2C40A7]">
                    <span>Total Interest: ₹{Math.max(0, (emi * calcMonths) - calcAmount).toLocaleString('en-IN')}</span>
                    <span>Total Repayment: ₹{(emi * calcMonths).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" render={<Link to="/signup" />}>
                  Apply for ₹{calcAmount.toLocaleString('en-IN')} Loan
                  <ArrowRight className="size-4" />
                </Button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="border-t-2 border-[#2C40A7] bg-[#FFFDF8] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FDE8F3] text-[#2C40A7] border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]">
              DESIGNED FOR SIMPLICITY
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#2C40A7]">
              Two core pillars powering your loan journey
            </h2>
            <p className="mt-3 text-base text-[#2C40A7]/80 font-medium">
              Loan Origination (LOS) handles instant application & automated approval. Loan Management (LMS) tracks payments & interest accrual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LOS Card */}
            <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FAF7F0] p-8 shadow-[5px_5px_0px_#2C40A7] relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-[#F237A1] text-white border-2 border-[#2C40A7] shadow-[2.5px_2.5px_0px_#2C40A7] flex items-center justify-center font-bold">
                  <Zap className="size-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F237A1]">PILLAR 01</span>
                  <h3 className="text-2xl font-extrabold text-[#2C40A7]">Loan Origination System (LOS)</h3>
                </div>
              </div>
              <p className="text-sm text-[#2C40A7]/85 font-medium leading-relaxed mb-6">
                From initial application form to rule-based underwriting decision. Calculates Debt-to-Income (FOIR) instantly to provide automated approval recommendations.
              </p>
              <ul className="space-y-2 text-xs font-mono font-bold text-[#2C40A7]">
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#F237A1]" />
                  Instant FOIR (Fixed Obligation to Income Ratio) Evaluation
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#2C40A7]" />
                  Automated Pre-qualification Engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#2C40A7]" />
                  Underwriter Review Queue & One-click Disbursement
                </li>
              </ul>
            </div>

            {/* LMS Card */}
            <div className="rounded-2xl border-2 border-[#2C40A7] bg-[#FAF7F0] p-8 shadow-[5px_5px_0px_#2C40A7] relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-[#2C40A7] text-white border-2 border-[#2C40A7] shadow-[2.5px_2.5px_0px_#F237A1] flex items-center justify-center font-bold">
                  <Wallet className="size-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C40A7]">PILLAR 02</span>
                  <h3 className="text-2xl font-extrabold text-[#2C40A7]">Loan Management System (LMS)</h3>
                </div>
              </div>
              <p className="text-sm text-[#2C40A7]/85 font-medium leading-relaxed mb-6">
                Complete post-disbursement lifecycle management. Automated reducing-balance amortization schedules, EMI tracking, and single-click installment recording.
              </p>
              <ul className="space-y-2 text-xs font-mono font-bold text-[#2C40A7]">
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#F237A1]" />
                  Reducing-Balance Amortization Engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#2C40A7]" />
                  Real-time Outstanding Principal Recalculation
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#2C40A7]" />
                  Instant Mock EMI Payment & Status Tracking
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-[#2C40A7] text-white py-16 border-t-2 border-b-2 border-[#2C40A7] relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F237A1] text-white border border-white mb-4">
            READY TO DEMO?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Experience the entire lending journey in under 2 minutes.
          </h2>
          <p className="mt-4 text-base text-white/80 max-w-xl mx-auto font-medium">
            Sign up as a new borrower or log in as our seeded admin to test the approval queue and loan disbursement flow live.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="bg-[#F237A1] hover:bg-[#e0258d] text-white border-2 border-white shadow-[3.5px_3.5px_0px_#FFFFFF]" render={<Link to="/signup" />}>
              Start Free Demo
              <ArrowRight className="size-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-[#FAF7F0] text-[#2C40A7] border-2 border-white hover:bg-white" render={<Link to="/login" />}>
              Admin Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAF7F0] py-10 border-t-2 border-[#2C40A7]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-[#2C40A7]">
          <div className="flex items-center gap-2">
            <span className="size-5 rounded bg-[#F237A1] text-white text-[10px] flex items-center justify-center font-extrabold">LM</span>
            <span>LMS Loan Origination & Management System</span>
          </div>
          <div>
            Built with React 19, Fastify, Drizzle ORM, SQLite & Riso Print Aesthetic.
          </div>
        </div>
      </footer>
    </main>
  );
}
