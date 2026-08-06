/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { BrandLogo } from '@/components/brand-logo/BrandLogo';

export function LandingFooter() {
  return (
    <footer className="bg-brand-paper py-10 border-t-2 border-brand-blue">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-brand-blue">
        <div className="flex items-center gap-3">
          <BrandLogo size="h-7" />
          <span>LMS Loan Origination &amp; Management System</span>
        </div>
        <p>Built with React 19, Fastify, Drizzle ORM, SQLite &amp; Riso Print Aesthetic.</p>
      </div>
    </footer>
  );
}
