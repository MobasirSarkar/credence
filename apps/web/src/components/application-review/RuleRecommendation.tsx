/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Sparkles } from 'lucide-react';
import type { ApplicationDTO } from '@lms/shared';

interface RuleRecommendationProps {
  recommendation: NonNullable<ApplicationDTO['recommendation']>;
}

export function RuleRecommendation({ recommendation }: RuleRecommendationProps) {
  return (
    <aside
      aria-label="Automated underwriting rule recommendation"
      className="rounded-2xl border-2 border-brand-blue bg-brand-pink-tint p-6 riso-shadow flex items-start gap-4"
    >
      <div className="size-10 rounded-xl bg-brand-pink text-primary-foreground border-2 border-brand-blue riso-shadow-sm flex items-center justify-center shrink-0">
        <Sparkles className="size-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-pink">
          Automated Underwriting Rule Recommendation
        </span>
        <div className="text-lg font-extrabold text-brand-blue capitalize">
          Rule Suggests: {recommendation.rule}
        </div>
        {recommendation.reason && (
          <p className="text-xs font-mono font-bold text-brand-blue/80">
            Reason: {recommendation.reason}
          </p>
        )}
        <p className="text-[11px] font-mono text-brand-blue/60 pt-1">
          The underwriting engine is advisory — as an underwriter, you can approve or override.
        </p>
      </div>
    </aside>
  );
}
