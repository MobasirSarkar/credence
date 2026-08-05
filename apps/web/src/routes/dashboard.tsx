/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { useLogout } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useLoans } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import { ArrowRight, FileText, Receipt, TrendingUp, Wallet, CircleAlert, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import type { ApplicationDTO, InstallmentDTO, LoanDTO } from '@lms/shared';

function nextEmi(loans: LoanDTO[] | undefined): { amount: number; due: string | null } | null {
  if (!loans) return null;
  let best: { amount: number; due: string } | null = null;
  for (const l of loans) {
    if (l.status !== 'active') continue;
    // We don't have installments here; derive a coarse estimate using outstanding / termMonths.
    const months = Math.max(1, l.termMonths);
    const remaining = l.outstanding;
    if (remaining <= 0) continue;
    if (!best) best = { amount: Math.round(remaining / months), due: 'next cycle' };
  }
  return best;
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Wallet;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
          {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationRow({ a }: { a: ApplicationDTO }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-medium">
          <Money cents={a.amount} />
          <span className="text-muted-foreground">·</span>
          <span>{a.termMonths}mo</span>
          <span className="text-muted-foreground">·</span>
          <span>{(a.annualRateBps / 100).toFixed(2)}%</span>
        </div>
        <div className="mt-0.5 truncate text-sm text-muted-foreground">
          {a.purpose} · {formatDate(a.createdAt)}
        </div>
      </div>
      <StatusBadge status={a.status} />
    </li>
  );
}

function LoanRow({ loan }: { loan: LoanDTO }) {
  // installments not on list endpoint; estimate progress from outstanding vs principal
  const progress = loan.principal > 0 ? Math.max(0, Math.min(100, ((loan.principal - loan.outstanding) / loan.principal) * 100)) : 0;
  return (
    <li className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/loans/${loan.id}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            <Money cents={loan.principal} /> · {loan.termMonths}mo
          </Link>
          <div className="mt-0.5 text-sm text-muted-foreground">
            Outstanding: <Money cents={loan.outstanding} />
          </div>
        </div>
        <StatusBadge status={loan.status} />
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress.toFixed(1)}%` }} />
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground tabular-nums">{progress.toFixed(0)}% repaid</div>
    </li>
  );
}

export function Dashboard() {
  const me = useMe();
  const apps = useApplications();
  const loans = useLoans();
  const logout = useLogout();
  const nav = useNavigate();

  const firstName = useMemo(() => (me.data?.user.fullName ?? '').split(' ')[0] || 'there', [me.data]);

  const outstanding = useMemo(
    () => (loans.data?.loans ?? []).filter((l) => l.status === 'active').reduce((s, l) => s + l.outstanding, 0),
    [loans.data]
  );
  const activeLoanCount = useMemo(
    () => (loans.data?.loans ?? []).filter((l) => l.status === 'active').length,
    [loans.data]
  );
  const activeAppCount = useMemo(
    () => (apps.data?.applications ?? []).filter((a) => a.status === 'pending').length,
    [apps.data]
  );
  const next = useMemo(() => nextEmi(loans.data?.loans), [loans.data]);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wallet className="size-4" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <h1 className="text-lg font-semibold leading-tight">Hi, {firstName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => nav('/apply')}
              disabled={me.isLoading}
            >
              {me.isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
              Apply for a loan
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
              {logout.isPending ? <Loader2 className="animate-spin" /> : null}
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Overview</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Wallet}
              label="Outstanding"
              value={loans.isLoading ? <Loader2 className="size-5 animate-spin" /> : <Money cents={outstanding} />}
              hint="Across all active loans"
            />
            <StatCard
              icon={TrendingUp}
              label="Next EMI"
              value={loans.isLoading ? <Loader2 className="size-5 animate-spin" /> : next ? <Money cents={next.amount} /> : '—'}
              hint={next?.due ?? 'No upcoming payments'}
            />
            <StatCard
              icon={FileText}
              label="Applications"
              value={apps.isLoading ? <Loader2 className="size-5 animate-spin" /> : activeAppCount}
              hint={`${activeAppCount} pending`}
            />
            <StatCard
              icon={Receipt}
              label="Active loans"
              value={loans.isLoading ? <Loader2 className="size-5 animate-spin" /> : activeLoanCount}
              hint={activeLoanCount === 0 ? 'No active loans' : `${activeLoanCount} running`}
            />
          </div>
        </section>

        <section aria-labelledby="apps-heading" className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 id="apps-heading" className="text-base font-semibold">Your applications</h2>
              <p className="text-sm text-muted-foreground">
                {apps.data ? `${apps.data.applications.length} total` : 'Loading'}
              </p>
            </div>
            <Button variant="outline" size="sm" render={<Link to="/apply" />}>
              New application
              <ArrowRight />
            </Button>
          </div>
          <Card>
            <CardContent className="p-3">
              {apps.isLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Loading applications
                </div>
              ) : apps.error ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <CircleAlert className="size-4" /> Could not load applications
                </div>
              ) : (apps.data?.applications.length ?? 0) === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No applications yet"
                  body="Start your first loan application — it takes about two minutes."
                  action={
                    <Button onClick={() => nav('/apply')}>
                      Apply for your first loan
                      <ArrowRight />
                    </Button>
                  }
                />
              ) : (
                <ul className="space-y-2">
                  {apps.data!.applications.map((a) => (
                    <ApplicationRow key={a.id} a={a} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="loans-heading" className="space-y-3">
          <div>
            <h2 id="loans-heading" className="text-base font-semibold">Your loans</h2>
            <p className="text-sm text-muted-foreground">
              {loans.data ? `${loans.data.loans.length} total` : 'Loading'}
            </p>
          </div>
          <Card>
            <CardContent className="p-3">
              {loans.isLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Loading loans
                </div>
              ) : loans.error ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                  <CircleAlert className="size-4" /> Could not load loans
                </div>
              ) : (loans.data?.loans.length ?? 0) === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No active loans"
                  body="Approved loans will appear here once disbursed."
                />
              ) : (
                <ul className="space-y-2">
                  {loans.data!.loans.map((l) => (
                    <LoanRow key={l.id} loan={l} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: typeof FileText;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      {action}
    </div>
  );
}
