/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { FileText } from 'lucide-react';

export function EmptyQueue() {
  return (
    <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-10 text-center riso-shadow">
      <FileText className="size-12 text-brand-blue/40 mx-auto mb-3" aria-hidden="true" />
      <h3 className="text-lg font-bold text-brand-blue">No pending applications in the review queue</h3>
      <p className="text-sm text-brand-blue/70 font-medium max-w-sm mx-auto mt-1">
        All submitted loan applications have been evaluated or decided.
      </p>
    </div>
  );
}
