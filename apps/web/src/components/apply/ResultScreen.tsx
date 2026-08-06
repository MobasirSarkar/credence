/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { ArrowRight, Check, CircleAlert, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ApplyResult {
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  reason: string | null;
}

interface ResultScreenProps {
  result: ApplyResult;
  onGoToDashboard: () => void;
  onStartNew: () => void;
}

const STATUS_COPY: Record<ApplyResult['status'], { label: string; help: string }> = {
  pending: {
    label: 'Pending',
    help: 'Your loan application has passed initial checks and is ready in your dashboard.',
  },
  approved: {
    label: 'Approved',
    help: 'Your loan application has been approved and is ready in your dashboard.',
  },
  disbursed: {
    label: 'Disbursed',
    help: 'Funds have been disbursed. See your dashboard for the schedule.',
  },
  rejected: {
    label: 'Rejected',
    help: 'Your application did not meet underwriting income criteria.',
  },
};

export function ResultScreen({ result, onGoToDashboard, onStartNew }: ResultScreenProps) {
  const isPositive = result.status === 'approved' || result.status === 'pending' || result.status === 'disbursed';
  const copy = STATUS_COPY[result.status];

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans p-6 flex items-center justify-center">
      <article
        aria-live="polite"
        className="max-w-lg w-full rounded-2xl border-2 border-brand-blue bg-brand-card p-8 riso-shadow-lg text-center space-y-6"
      >
        <div className="flex justify-center">
          <div
            className={`size-16 rounded-2xl border-2 border-brand-blue flex items-center justify-center riso-shadow-sm ${
              isPositive ? 'bg-brand-pink text-primary-foreground' : 'bg-destructive text-destructive-foreground'
            }`}
          >
            {isPositive ? (
              <Check className="size-8 stroke-3" aria-hidden="true" />
            ) : (
              <CircleAlert className="size-8 stroke-3" aria-hidden="true" />
            )}
          </div>
        </div>

        <header>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-blue/70 block mb-1">
            Application Status Result
          </span>
          <h1 className="text-3xl font-extrabold text-brand-blue">
            Application {result.status.toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-brand-blue/80 font-medium">
            {result.reason ?? copy.help}
          </p>
        </header>

        {result.reason && !isPositive && (
          <aside className="rounded-xl border-2 border-brand-blue bg-brand-pink-tint p-4 text-left font-mono text-xs font-bold text-brand-blue">
            <span className="text-brand-pink block mb-0.5">Underwriting Reason:</span>
            {result.reason}
          </aside>
        )}

        <footer className="pt-4 border-t-2 border-brand-blue/20 flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={onGoToDashboard}>
            Go to Dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" onClick={onStartNew}>
            <RefreshCw className="size-4 text-brand-pink" aria-hidden="true" />
            New Application
          </Button>
        </footer>
      </article>
    </main>
  );
}
