/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

interface ApplicationReviewHeaderProps {
  applicationId: string;
  status: string;
}

export function ApplicationReviewHeader({ applicationId, status }: ApplicationReviewHeaderProps) {
  return (
    <header className="border-b-2 border-brand-blue bg-brand-paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link
          to="/admin/review"
          className="flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-pink transition-colors"
        >
          <ArrowLeft className="size-4 stroke-[2.5]" aria-hidden="true" />
          Back to Underwriting Review
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-brand-blue/70">
            APP #{applicationId.slice(0, 8)}
          </span>
          <StatusBadge status={status} />
        </div>
      </div>
    </header>
  );
}
