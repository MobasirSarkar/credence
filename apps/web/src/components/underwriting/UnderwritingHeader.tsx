/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnderwritingHeaderProps {
  onLogout: () => void;
}

export function UnderwritingHeader({ onLogout }: UnderwritingHeaderProps) {
  return (
    <header className="border-b-2 border-brand-blue bg-brand-paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" render={<Link to="/dashboard" />}>
            <ArrowLeft className="size-4 stroke-[2.5]" aria-hidden="true" />
            Dashboard
          </Button>
          <div className="flex items-center gap-2 border-l-2 border-brand-blue/20 pl-3">
            <ShieldCheck className="size-5 text-brand-pink" aria-hidden="true" />
            <span className="font-extrabold text-base text-brand-blue">Underwriter Desk</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-pink text-primary-foreground border border-brand-blue">
            Underwriter Role
          </span>
          <Button size="sm" variant="outline" onClick={onLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
