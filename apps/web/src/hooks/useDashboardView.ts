/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { useLogout } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useLoans } from '@/hooks/useLoans';
import { useDashboardStore, type DashboardTab } from '@/stores/useDashboardStore';
import type { ApplicationDTO, LoanDTO, UserDTO } from '@lms/shared';

export { type DashboardTab };

export interface DashboardTotals {
  totalDisbursedCents: number;
  totalOutstandingCents: number;
  totalLoansCount: number;
  activeLoansCount: number;
  pendingAppsCount: number;
  avgLoanCents: number;
  repaidPct: number;
}

export interface DashboardView {
  user: UserDTO | null;
  activeTab: DashboardTab;
  searchQuery: string;
  setActiveTab: (tab: DashboardTab) => void;
  setSearchQuery: (q: string) => void;
  applications: ApplicationDTO[];
  loans: LoanDTO[];
  filteredApps: ApplicationDTO[];
  filteredLoans: LoanDTO[];
  totals: DashboardTotals;
  onApply: () => void;
  onLogout: () => void;
}

/**
 * Single source of truth for the dashboard view.
 *
 * Owns the active tab and search query (UI state), composes the data
 * hooks (me/applications/loans), and exposes memoized derived data
 * (totals, filtered lists, counts) so consumers don't recompute.
 */
export function useDashboardView(): DashboardView {
  const me = useMe();
  const apps = useApplications();
  const loans = useLoans();
  const logout = useLogout();
  const nav = useNavigate();

  const activeTab = useDashboardStore((s) => s.activeTab);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  const applications = useMemo<ApplicationDTO[]>(
    () => apps.data?.applications ?? [],
    [apps.data?.applications],
  );
  const loansList = useMemo<LoanDTO[]>(() => loans.data?.loans ?? [], [loans.data?.loans]);

  const totals = useMemo<DashboardTotals>(() => {
    const totalDisbursedCents = loansList.reduce((sum, l) => sum + l.principal, 0);
    const totalOutstandingCents = loansList.reduce((sum, l) => sum + l.outstanding, 0);
    const totalLoansCount = loansList.length;
    const activeLoansCount = loansList.filter((l) => l.status === 'active').length;
    const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;
    const avgLoanCents = totalLoansCount > 0 ? Math.round(totalDisbursedCents / totalLoansCount) : 0;
    const repaidPct =
      totalDisbursedCents > 0
        ? Math.round(((totalDisbursedCents - totalOutstandingCents) / totalDisbursedCents) * 100)
        : 0;
    return {
      totalDisbursedCents,
      totalOutstandingCents,
      totalLoansCount,
      activeLoansCount,
      pendingAppsCount,
      avgLoanCents,
      repaidPct,
    };
  }, [loansList, applications]);

  const normalizedQuery = searchQuery.toLowerCase();
  const filteredApps = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.purpose.toLowerCase().includes(normalizedQuery) ||
          a.status.includes(normalizedQuery),
      ),
    [applications, normalizedQuery],
  );
  const filteredLoans = useMemo(
    () =>
      loansList.filter(
        (l) => l.id.toLowerCase().includes(normalizedQuery) || l.status.includes(normalizedQuery),
      ),
    [loansList, normalizedQuery],
  );

  const onApply = useCallback(() => nav('/apply'), [nav]);
  const onLogout = useCallback(() => logout.mutate(), [logout]);

  return {
    user: me.data?.user ?? null,
    activeTab,
    searchQuery,
    setActiveTab,
    setSearchQuery,
    applications,
    loans: loansList,
    filteredApps,
    filteredLoans,
    totals,
    onApply,
    onLogout,
  };
}
