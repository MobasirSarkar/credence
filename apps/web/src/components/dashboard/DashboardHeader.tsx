/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  eyebrow: string;
  title: string;
  onApply: () => void;
}

export function DashboardHeader({ eyebrow, title, onApply }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-brand-blue/70">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-extrabold text-brand-blue">{title}</h1>
      </div>
      <Button variant="outline" size="sm" onClick={onApply}>
        <Plus className="size-4 text-brand-pink" aria-hidden="true" />
        New Application
      </Button>
    </header>
  );
}
