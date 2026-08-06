/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Money } from '@/components/Money';
import { formatINR } from '@/lib/format';
import type { DashboardTotals } from '@/hooks/useDashboardView';

interface PortfolioOverviewProps {
  totals: DashboardTotals;
}

export function PortfolioOverview({ totals }: PortfolioOverviewProps) {
  const stats = buildStats(totals);
  return (
    <section
      aria-label="Portfolio overview"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
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
  );
}

function buildStats(totals: DashboardTotals) {
  const {
    totalDisbursedCents,
    totalOutstandingCents,
    totalLoansCount,
    activeLoansCount,
    pendingAppsCount,
    avgLoanCents,
    repaidPct,
  } = totals;

  return [
    {
      key: 'disbursed',
      label: 'TOTAL DISBURSED',
      value: <Money cents={totalDisbursedCents} />,
      footer: (
        <>
          <TrendingUp className="size-3.5" aria-hidden="true" />
          {totalLoansCount > 0 ? `${totalLoansCount} loan(s) issued` : 'No loans issued yet'}
        </>
      ),
      secondary: avgLoanCents > 0 ? `Avg ${formatINR(avgLoanCents)}` : undefined,
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
  ];
}
