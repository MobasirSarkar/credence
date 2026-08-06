/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

interface UnderwritingPageHeaderProps {
  count: number;
  isLoading: boolean;
}

export function UnderwritingPageHeader({ count, isLoading }: UnderwritingPageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-brand-blue/20 pb-4">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-blue/70">
          Underwriting Review
        </span>
        <h1 className="text-3xl font-extrabold text-brand-blue">Pending Loan Applications</h1>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-pink-tint text-brand-blue border-2 border-brand-blue riso-shadow-sm">
        {isLoading ? 'Loading…' : `${count} Pending Review`}
      </span>
    </header>
  );
}
