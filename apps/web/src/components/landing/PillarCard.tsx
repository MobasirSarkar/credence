/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { ComponentType } from 'react';

export interface PillarSpec {
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconShadow: string;
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  description: string;
  items: readonly string[];
  firstDot: string;
}

interface PillarCardProps extends PillarSpec {}

export function PillarCard({
  icon: Icon,
  iconBg,
  iconShadow,
  eyebrow,
  eyebrowClassName,
  title,
  description,
  items,
  firstDot,
}: PillarCardProps) {
  return (
    <article className="rounded-2xl border-2 border-brand-blue bg-brand-paper p-8 riso-shadow-lg relative overflow-hidden group hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
      <header className="flex items-center gap-3 mb-4">
        <div
          className={`size-12 rounded-xl text-primary-foreground border-2 border-brand-blue ${iconShadow} flex items-center justify-center font-bold ${iconBg}`}
        >
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <div>
          <p className={`text-xs font-mono font-bold uppercase tracking-wider ${eyebrowClassName}`}>
            {eyebrow}
          </p>
          <h3 className="text-2xl font-extrabold text-brand-blue">{title}</h3>
        </div>
      </header>
      <p className="text-sm text-brand-blue/85 font-medium leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2 text-xs font-mono font-bold text-brand-blue list-none">
        {items.map((item, idx) => (
          <li key={item} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${idx === 0 ? firstDot : 'bg-brand-blue'}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
