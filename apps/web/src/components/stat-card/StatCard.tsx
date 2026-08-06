/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '../progress-bar/ProgressBar';

type StatCardProps = {
  label: string;
  value: ReactNode;
  footer: ReactNode;
  secondaryFooter?: ReactNode;
  barColor: string;
  barTrackColor: string;
  barWidth: number;
};

export function StatCard({
  label,
  value,
  footer,
  secondaryFooter,
  barColor,
  barTrackColor,
  barWidth,
}: StatCardProps) {
  return (
    <Card className="riso-shadow p-5 relative overflow-hidden">
      <CardContent className="p-0 space-y-3">
        <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue/70">
          {label}
        </p>
        <p className="text-3xl font-extrabold font-mono text-brand-blue">{value}</p>
        <div className="flex items-center justify-between text-xs font-bold text-brand-pink">
          <span className="flex items-center gap-1">{footer}</span>
          {secondaryFooter && (
            <span className="text-[10px] font-mono text-brand-blue/70 font-normal">
              {secondaryFooter}
            </span>
          )}
        </div>
        <ProgressBar
          width={barWidth}
          fillColor={barColor}
          trackColor={barTrackColor}
          size="sm"
          label={label}
        />
      </CardContent>
    </Card>
  );
}
