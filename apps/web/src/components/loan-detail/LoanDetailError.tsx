/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoanDetailError() {
  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue p-6 flex flex-col items-center justify-center">
      <article
        role="alert"
        className="max-w-md w-full rounded-2xl border-2 border-brand-blue bg-brand-card p-8 riso-shadow-lg text-center space-y-4"
      >
        <CircleAlert className="size-12 text-destructive mx-auto" aria-hidden="true" />
        <header className="space-y-1">
          <h1 className="text-2xl font-extrabold">Loan Not Found</h1>
          <p className="text-sm text-brand-blue/80 font-medium">
            The requested loan details could not be loaded.
          </p>
        </header>
        <Button render={<Link to="/dashboard" />}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Dashboard
        </Button>
      </article>
    </main>
  );
}
