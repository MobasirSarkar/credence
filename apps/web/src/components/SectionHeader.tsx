/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  count?: number;
  iconClassName?: string;
  countClassName?: string;
  actions?: ReactNode;
};

export function SectionHeader({
  icon: Icon,
  title,
  count,
  iconClassName = 'text-brand-pink',
  countClassName = 'bg-brand-pink-tint text-brand-blue',
  actions,
}: SectionHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-brand-blue">
        <Icon className={`size-5 ${iconClassName}`} />
        {title}
        {count !== undefined && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${countClassName} border border-brand-blue`}
          >
            {count}
          </span>
        )}
      </h2>
      {actions}
    </header>
  );
}