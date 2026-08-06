/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useCallback, useMemo, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { useLogout } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useLoans } from '@/hooks/useLoans';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatCard } from '@/components/StatCard';
import { SectionHeader } from '@/components/SectionHeader';
import { ProgressBar } from '@/components/ProgressBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import {
  ArrowRight, FileText, Receipt, TrendingUp, Wallet, Plus,
} from 'lucide-react';

const TAB_LABELS = {
  overview: { eyebrow: 'PRODUCTION DASHBOARD', title: (name: string) => `Welcome back, ${name}` },
  applications: { eyebrow: 'LOAN APPLICATIONS', title: () => 'Your Applications' },
  loans: { eyebrow: 'ACTIVE LOAN PORTFOLIO', title: () => 'Your Active Loans' },
} as const;

const TAB_BUTTON_LABELS = {
  overview: 'Overview',
  applications: 'Applications',
  loans: 'Active Loans',
} as const;

type TabKey = keyof typeof TAB_LABELS;

type StatConfig = {
  key: string;
  label: string;
  value: ReactNode;
  footer: ReactNode;
  secondary?: ReactNode;
  barColor: string;
  barTrackColor: string;
  barWidth: number;
};

export function Dashboard() {
  const me = useMe();
  const apps = useApplications();
  const loans = useLoans();
  const logout = useLogout();
  const nav = useNavigate();

  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  const userName = me.data?.user?.fullName ?? 'Borrower';
  const user = me.data?.user;

  const allLoansList = useMemo(() => loans.data?.loans ?? [], [loans.data?.loans]);
  const allAppsList = useMemo(() => apps.data?.applications ?? [], [apps.data?.applications]);

  const totalDisbursedCents = useMemo(
    () => allLoansList.reduce((sum, l) => sum + l.principal, 0),
    [allLoansList],
  );
  const totalOutstandingCents = useMemo(
    () => allLoansList.reduce((sum, l) => sum + l.outstanding, 0),
    [allLoansList],
  );
  const activeLoansCount = useMemo(
    () => allLoansList.filter((l) => l.status === 'active').length,
    [allLoansList],
  );
  const pendingAppsCount = useMemo(
    () => allAppsList.filter((a) => a.status === 'pending').length,
    [allAppsList],
  );

  const totalLoansCount = allLoansList.length;
  const avgLoanCents = useMemo(
    () => (totalLoansCount > 0 ? Math.round(totalDisbursedCents / totalLoansCount) : 0),
    [totalDisbursedCents, totalLoansCount],
  );
  const repaidPct = useMemo(
    () =>
      totalDisbursedCents > 0
        ? Math.round(((totalDisbursedCents - totalOutstandingCents) / totalDisbursedCents) * 100)
        : 0,
    [totalDisbursedCents, totalOutstandingCents],
  );

  const filteredApps = useMemo(
    () =>
      allAppsList.filter(
        (a) =>
          a.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.status.includes(searchQuery.toLowerCase()),
      ),
    [allAppsList, searchQuery],
  );
  const filteredLoans = useMemo(
    () =>
      allLoansList.filter(
        (l) =>
          l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.status.includes(searchQuery.toLowerCase()),
      ),
    [allLoansList, searchQuery],
  );

  const handleApplyClick = useCallback(() => nav('/apply'), [nav]);
  const handleLogoutClick = useCallback(() => logout.mutate(), [logout]);

  const tabKey = (activeTab ?? 'overview') as TabKey;
  const eyebrow = TAB_LABELS[tabKey].eyebrow;
  const title = TAB_LABELS[tabKey].title(userName);

  const stats = useMemo<StatConfig[]>(
    () => [
      {
        key: 'disbursed',
        label: 'TOTAL DISBURSED',
        value: <Money cents={totalDisbursedCents} />,
        footer: (
          <>
            <TrendingUp className="size-3.5" />
            {totalLoansCount > 0 ? `${totalLoansCount} loan(s) issued` : 'No loans issued yet'}
          </>
        ),
        secondary: avgLoanCents > 0 ? `Avg ₹${(avgLoanCents / 100).toLocaleString('en-IN')}` : undefined,
        barColor: 'bg-brand-pink',
        barTrackColor: 'bg-brand-pink-tint',
        barWidth: totalLoansCount > 0 ? Math.min(100, totalLoansCount * 25) : 0,
      },
      {
        key: 'active',
        label: 'ACTIVE LOANS',
        value: activeLoansCount,
        footer: activeLoansCount > 0
          ? `${activeLoansCount} active repayment schedule(s)`
          : 'No active loans',
        barColor: 'bg-brand-blue',
        barTrackColor: 'bg-brand-blue-tint',
        barWidth: activeLoansCount > 0 ? Math.min(100, activeLoansCount * 25) : 0,
      },
      {
        key: 'outstanding',
        label: 'OUTSTANDING PRINCIPAL',
        value: <Money cents={totalOutstandingCents} />,
        footer: totalDisbursedCents > 0 ? `${repaidPct}% repaid so far` : 'Zero balance',
        barColor: 'bg-brand-pink',
        barTrackColor: 'bg-brand-paper',
        barWidth: repaidPct,
      },
      {
        key: 'pending',
        label: 'PENDING APPLICATIONS',
        value: pendingAppsCount,
        footer: pendingAppsCount > 0 ? 'Underwriting rule evaluating' : 'All applications processed',
        barColor: 'bg-brand-blue',
        barTrackColor: 'bg-brand-pink-tint',
        barWidth: pendingAppsCount > 0 ? Math.min(100, pendingAppsCount * 25) : 0,
      },
    ],
    [totalDisbursedCents, totalLoansCount, avgLoanCents, activeLoansCount, totalOutstandingCents, repaidPct, pendingAppsCount],
  );

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-white pb-20">
      <AppHeader
        {...(user ? { user: { fullName: user.fullName, role: user.role } } : {})}
        onApply={handleApplyClick}
        onLogout={handleLogoutClick}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Dashboard Section Tabs */}
      <nav aria-label="Dashboard sections" className="border-t border-brand-blue/20 bg-brand-paper px-6">
        <div className="mx-auto max-w-7xl flex items-center gap-8 text-sm font-bold pt-2 pb-0">
          {(['overview', 'applications', 'loans'] as const).map((key) => {
            const badge =
              key === 'applications' && pendingAppsCount > 0
                ? { count: pendingAppsCount, color: 'pink' as const }
                : key === 'loans' && activeLoansCount > 0
                  ? { count: activeLoansCount, color: 'blue' as const }
                  : null;
            return (
              <TabButton
                key={key}
                active={activeTab === key}
                onClick={() => setActiveTab(key)}
                label={TAB_BUTTON_LABELS[key]}
                {...(badge ? { badge } : {})}
              />
            );
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        {/* Page Title */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-brand-blue/70">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-extrabold text-brand-blue">{title}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleApplyClick}>
            <Plus className="size-4 text-brand-pink" />
            New Application
          </Button>
        </header>

        {/* Portfolio Overview — stat cards */}
        {activeTab === 'overview' && (
          <section aria-label="Portfolio overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <StatCard
                key={s.key}
                label={s.label}
                value={s.value}
                footer={s.footer}
                {...(s.secondary ? { secondaryFooter: s.secondary } : {})}
                barColor={s.barColor}
                barTrackColor={s.barTrackColor}
                barWidth={s.barWidth}
              />
            ))}
          </section>
        )}

        {/* Loan Applications */}
        {(activeTab === 'overview' || activeTab === 'applications') && (
          <section aria-label="Loan applications" className="space-y-4">
            <SectionHeader icon={FileText} title="Your Loan Applications" count={filteredApps.length} />

            {filteredApps.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No loan applications found"
                description="Apply in under 2 minutes with instant FOIR evaluation and zero branch visits."
                action={
                  <Button onClick={handleApplyClick}>
                    Apply for Your First Loan
                    <ArrowRight className="size-4" />
                  </Button>
                }
              />
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
                {filteredApps.map((a) => (
                  <li key={a.id}>
                    <Card className="p-5 riso-shadow-sm hover:translate-x-px hover:translate-y-1px transition-all flex flex-col justify-between h-full">
                      <div>
                        <header className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="text-[10px] font-mono font-bold text-brand-blue/60 uppercase tracking-wider">
                              APPLICATION #{a.id.slice(0, 8)}
                            </p>
                            <h3 className="text-xl font-extrabold font-mono text-brand-blue">
                              <Money cents={a.amount} />
                            </h3>
                          </div>
                          <StatusBadge status={a.status} />
                        </header>
                        <dl className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-brand-paper p-3 rounded-lg border border-brand-blue/30 mb-3">
                          <div>
                            <dt className="text-brand-blue/60 text-[10px]">TENURE</dt>
                            <dd>{a.termMonths} Months</dd>
                          </div>
                          <div>
                            <dt className="text-brand-blue/60 text-[10px]">INTEREST RATE</dt>
                            <dd>{(a.annualRateBps / 100).toFixed(2)}% APR</dd>
                          </div>
                          <div className="col-span-2 pt-1 border-t border-brand-blue/10">
                            <dt className="text-brand-blue/60 text-[10px]">PURPOSE</dt>
                            <dd className="capitalize">{a.purpose}</dd>
                          </div>
                        </dl>
                      </div>
                      <footer className="flex items-center justify-between pt-2 text-xs font-mono font-bold border-t border-brand-blue/20">
                        <span className="text-brand-blue/70">Submitted {formatDate(a.createdAt)}</span>
                        {a.status === 'disbursed' && (
                          <Link to={`/loans/${a.id}`} className="text-brand-pink hover:underline flex items-center gap-1 font-bold">
                            View Active Loan <ArrowRight className="size-3.5" />
                          </Link>
                        )}
                      </footer>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Active Loans */}
        {(activeTab === 'overview' || activeTab === 'loans') && (
          <section aria-label="Active loans" className="space-y-4 pt-4">
            <SectionHeader
              icon={Receipt}
              title="Active Loan Lifecycle"
              count={filteredLoans.length}
              iconClassName="text-brand-blue"
              countClassName="bg-brand-blue-tint text-brand-blue"
            />

            {filteredLoans.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title="No active loans yet"
                description="Once your application is approved and disbursed by the underwriter, your loan schedule will appear here."
              />
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
                {filteredLoans.map((l) => {
                  const percentPaid = Math.round(((l.principal - l.outstanding) / l.principal) * 100);
                  return (
                    <li key={l.id}>
                      <Card className="p-5 riso-shadow-sm hover:translate-x-px hover:translate-y-px transition-all flex flex-col justify-between h-full">
                        <div>
                          <header className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <p className="text-[10px] font-mono font-bold text-brand-blue/60 uppercase tracking-wider">
                                LOAN ID #{l.id.slice(0, 8)}
                              </p>
                              <h3 className="text-xl font-extrabold font-mono text-brand-blue">
                                <Money cents={l.principal} />
                              </h3>
                            </div>
                            <StatusBadge status={l.status} />
                          </header>

                          <div className="space-y-1.5 mb-4">
                            <div className="flex justify-between text-xs font-mono font-bold">
                              <span className="text-brand-blue">Repayment Progress</span>
                              <span className="text-brand-pink">{percentPaid}% Paid</span>
                            </div>
                            <ProgressBar
                              width={percentPaid}
                              fillColor="bg-brand-pink"
                              label={`Loan ${l.id} repayment`}
                            />
                          </div>

                          <dl className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-brand-paper p-3 rounded-lg border border-brand-blue/30 mb-3">
                            <div>
                              <dt className="text-brand-blue/60 text-[10px]">OUTSTANDING</dt>
                              <dd className="text-brand-pink font-bold"><Money cents={l.outstanding} /></dd>
                            </div>
                            <div>
                              <dt className="text-brand-blue/60 text-[10px]">TENURE / RATE</dt>
                              <dd>{l.termMonths}m @ {(l.annualRateBps / 100).toFixed(2)}%</dd>
                            </div>
                          </dl>
                        </div>

                        <footer className="flex items-center justify-between pt-3 border-t border-brand-blue/20">
                          <span className="text-xs font-mono font-bold text-brand-blue/70">
                            Start: {formatDate(l.startDate)}
                          </span>
                          <Link to={`/loans/${l.id}`}>
                            <Button size="sm">
                              Manage & Pay EMI
                              <ArrowRight className="size-3.5" />
                            </Button>
                          </Link>
                        </footer>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: { count: number; color: 'pink' | 'blue' };
};

function TabButton({ active, onClick, label, badge }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
        active
          ? 'border-brand-pink text-brand-blue font-extrabold'
          : 'border-transparent text-brand-blue/60 hover:text-brand-blue'
      }`}
    >
      {label}
      {badge && (
        <span
          className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full text-white font-bold ${
            badge.color === 'pink' ? 'bg-brand-pink' : 'bg-brand-blue'
          }`}
        >
          {badge.count}
        </span>
      )}
    </button>
  );
}
