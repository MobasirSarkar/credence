/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useDashboardView, type DashboardTab } from '@/hooks/useDashboardView';
import { AppHeader } from '@/components/app-header/AppHeader';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { ApplicationsList } from '@/components/dashboard/ApplicationsList';
import { ActiveLoans } from '@/components/dashboard/ActiveLoans';

const TAB_LABELS: Readonly<Record<DashboardTab, string>> = {
  overview: 'Overview',
  applications: 'Applications',
  loans: 'Active Loans',
};

const TAB_EYEBROW: Readonly<Record<DashboardTab, string>> = {
  overview: 'Production Dashboard',
  applications: 'Loan Applications',
  loans: 'Active Loan Portfolio',
};

export function Dashboard() {
  const view = useDashboardView();
  const { activeTab, totals, user, onApply, onLogout, searchQuery, setSearchQuery } = view;

  const tabKey = activeTab ?? 'overview';
  const title = tabKey === 'overview' ? `Welcome back, ${user?.fullName ?? 'Borrower'}` : TAB_LABELS[tabKey];

  const tabs = [
    { key: 'overview' as const, label: TAB_LABELS.overview },
    {
      key: 'applications' as const,
      label: TAB_LABELS.applications,
      ...(totals.pendingAppsCount > 0 ? { badge: { count: totals.pendingAppsCount, color: 'pink' as const } } : {}),
    },
    {
      key: 'loans' as const,
      label: TAB_LABELS.loans,
      ...(totals.activeLoansCount > 0 ? { badge: { count: totals.activeLoansCount, color: 'blue' as const } } : {}),
    },
  ];

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-primary-foreground pb-20">
      <AppHeader
        {...(user ? { user: { fullName: user.fullName, role: user.role } } : {})}
        onApply={onApply}
        onLogout={onLogout}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <DashboardTabs tabs={tabs} active={tabKey} onSelect={view.setActiveTab} />

      <div className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        <DashboardHeader
          eyebrow={TAB_EYEBROW[tabKey]}
          title={title}
          onApply={onApply}
        />

        {tabKey === 'overview' && <PortfolioOverview totals={totals} />}

        {(tabKey === 'overview' || tabKey === 'applications') && (
          <ApplicationsList applications={view.filteredApps} onApply={onApply} />
        )}

        {(tabKey === 'overview' || tabKey === 'loans') && (
          <ActiveLoans loans={view.filteredLoans} />
        )}
      </div>
    </main>
  );
}
