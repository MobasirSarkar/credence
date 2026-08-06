/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { DashboardTab } from '@/hooks/useDashboardView';

interface TabSpec {
  key: DashboardTab;
  label: string;
  badge?: { count: number; color: 'pink' | 'blue' };
}

interface DashboardTabsProps {
  tabs: TabSpec[];
  active: DashboardTab;
  onSelect: (tab: DashboardTab) => void;
}

export function DashboardTabs({ tabs, active, onSelect }: DashboardTabsProps) {
  return (
    <nav aria-label="Dashboard sections" className="border-t border-brand-blue/20 bg-brand-paper px-6">
      <ul className="mx-auto max-w-7xl flex items-center gap-8 text-sm font-bold pt-2 pb-0 list-none">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key}>
              <TabButton
                active={isActive}
                onClick={() => onSelect(tab.key)}
                label={tab.label}
                {...(tab.badge ? { badge: tab.badge } : {})}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: { count: number; color: 'pink' | 'blue' };
}

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
          className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full text-primary-foreground font-bold ${
            badge.color === 'pink' ? 'bg-brand-pink' : 'bg-brand-blue'
          }`}
        >
          {badge.count}
        </span>
      )}
    </button>
  );
}
