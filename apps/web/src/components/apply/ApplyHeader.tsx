/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ApplyHeaderProps {
  backTo?: string;
}

export function ApplyHeader({ backTo = '/dashboard' }: ApplyHeaderProps) {
  return (
    <header className="border-b-2 border-[#2C40A7] bg-[#FAF7F0] sticky top-0 z-40">
      <nav
        aria-label="Application navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link
          to={backTo}
          className="flex items-center gap-2 text-sm font-bold text-[#2C40A7] hover:text-[#F237A1] transition-colors"
        >
          <ArrowLeft className="size-4 stroke-[2.5]" aria-hidden="true" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded bg-[#F237A1] text-white text-xs font-bold border border-[#2C40A7]"
          >
            LM
          </span>
          <span className="font-extrabold text-base text-[#2C40A7]">Loan Wizard</span>
        </div>
      </nav>
    </header>
  );
}
