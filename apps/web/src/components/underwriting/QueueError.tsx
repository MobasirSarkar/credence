/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { CircleAlert } from 'lucide-react';

export function QueueError() {
  return (
    <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-8 text-center riso-shadow">
      <CircleAlert className="size-10 text-destructive mx-auto mb-2" aria-hidden="true" />
      <p className="text-sm font-bold text-brand-blue">Failed to load the underwriting review queue.</p>
    </div>
  );
}
