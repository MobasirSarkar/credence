/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useUnderwritingReview } from '@/hooks/useUnderwritingReview';
import { LoadingState } from '@/components/loading-screen/LoadingScreen';
import { UnderwritingHeader } from '@/components/underwriting/UnderwritingHeader';
import { UnderwritingPageHeader } from '@/components/underwriting/UnderwritingPageHeader';
import { UnderwritingTable } from '@/components/underwriting/UnderwritingTable';
import { EmptyQueue } from '@/components/underwriting/EmptyQueue';
import { QueueError } from '@/components/underwriting/QueueError';

export function UnderwritingReview() {
  const view = useUnderwritingReview();

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-primary-foreground pb-20">
      <UnderwritingHeader onLogout={view.onLogout} />

      <div className="mx-auto max-w-6xl px-6 pt-8 space-y-6">
        <UnderwritingPageHeader count={view.count} isLoading={view.isLoading} />

        {view.isLoading ? (
          <LoadingState text="Fetching pending queue..." />
        ) : view.isError ? (
          <QueueError />
        ) : view.applications.length === 0 ? (
          <EmptyQueue />
        ) : (
          <UnderwritingTable applications={view.applications} onReview={view.onReview} />
        )}
      </div>
    </main>
  );
}
