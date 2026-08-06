/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-brand-blue text-primary-foreground py-16 border-t-2 border-b-2 border-brand-blue relative overflow-hidden"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-pink text-primary-foreground border border-primary-foreground mb-4">
          Ready to Demo?
        </span>
        <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold text-primary-foreground">
          Experience the entire lending journey in under 2 minutes.
        </h2>
        <p className="mt-4 text-base text-primary-foreground/80 max-w-xl mx-auto font-medium">
          Sign up as a new borrower or log in as our seeded admin to test the approval queue and
          loan disbursement flow live.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Button
            size="lg"
            className="bg-brand-pink hover:bg-brand-pink/90 text-primary-foreground border-2 border-primary-foreground shadow-[3.5px_3.5px_0px_var(--color-primary-foreground)]"
            render={<Link to="/signup" />}
          >
            Start Free Demo
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-brand-paper text-brand-blue border-2 border-primary-foreground hover:bg-primary-foreground"
            render={<Link to="/login" />}
          >
            Admin Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
