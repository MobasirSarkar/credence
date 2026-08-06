/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBenefits } from './HeroBenefits';

export function HeroSection() {
  return (
    <div className="lg:col-span-7 flex flex-col items-start">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-brand-blue bg-brand-card px-3.5 py-1 text-xs font-mono font-bold text-brand-blue riso-shadow-sm mb-6">
        <span aria-hidden="true" className="size-2 rounded-full bg-brand-pink animate-pulse" />
        Automated Loan Origination &amp; Management
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
        We mix automated rule engines and zero-paperwork workflows on warm off-white digital paper
        — every loan, schedule, and instant EMI payment delivered with complete clarity.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button size="lg" className="text-base py-6 px-7" render={<Link to="/signup" />}>
          Apply in 2 minutes
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
        <a href="#calculator">
          <Button size="lg" variant="outline" className="text-base py-6 px-7">
            <Calculator className="size-5 text-brand-pink" aria-hidden="true" />
            Calculate EMI
          </Button>
        </a>
      </div>

      <HeroBenefits />
    </div>
  );
}
