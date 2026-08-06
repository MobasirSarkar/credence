/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMe } from '@/hooks/useMe';
import { useEmiCalculator } from '@/hooks/useEmiCalculator';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { EmiCalculator } from '@/components/landing/EmiCalculator';
import { PillarsSection } from '@/components/landing/PillarsSection';
import { CallToAction } from '@/components/landing/CallToAction';
import { LandingFooter } from '@/components/landing/LandingFooter';

export function Landing() {
  const calc = useEmiCalculator();
  const isLoggedIn = !!useMe().data?.user;

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-primary-foreground">
      <LandingHeader isLoggedIn={isLoggedIn} />

      <section
        aria-labelledby="hero-heading"
        className="mx-auto max-w-6xl px-6 pt-12 pb-20 lg:pt-16 lg:pb-28"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <HeroSection />
          <EmiCalculator calc={calc} />
        </div>
      </section>

      <PillarsSection />
      <CallToAction />
      <LandingFooter />
    </main>
  );
}
