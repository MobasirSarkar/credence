/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Wallet, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative isolate overflow-hidden">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-muted/60 to-transparent" aria-hidden />

        <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wallet className="size-4" />
            </span>
            <span>LMS</span>
          </Link>
          <Button variant="ghost" size="sm" render={<Link to="/login" />}>
            Sign in
          </Button>
        </header>

        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-24 text-center sm:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5" />
            Personal loans, made simple
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Apply in two minutes, repay on your terms.
          </h1>
          <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            Submit a loan application, track approval, and manage repayments — all in one place.
            Transparent rates, no hidden fees, no paperwork.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link to="/signup" />}>
              Get started
              <ArrowRight />
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/login" />}>
              Sign in
            </Button>
          </div>

          <ul className="mt-16 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Apply in 2 minutes', body: 'No paperwork. No branch visits.' },
              { icon: TrendingUp, title: 'Transparent rates', body: 'Know your EMI before you apply.' },
              { icon: Wallet, title: 'No hidden fees', body: 'Pay only what you borrow.' },
            ].map((f) => (
              <li key={f.title} className="rounded-lg border bg-card/60 p-4 backdrop-blur">
                <f.icon className="size-4 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">{f.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
