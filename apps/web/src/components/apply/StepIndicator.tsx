/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { STEP_TITLES, STEP_COUNT, type StepIndex } from './constants';

interface StepIndicatorProps {
  step: StepIndex;
}

export function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <section
      aria-label="Wizard progress"
      className="rounded-xl border-2 border-brand-blue bg-brand-card p-4 riso-shadow flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-lg bg-brand-blue text-primary-foreground font-mono font-bold text-sm"
        >
          {step + 1}
        </span>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-blue/70 block">
            STEP {step + 1} OF {STEP_COUNT}
          </span>
          <h2 className="text-lg font-extrabold text-brand-blue">{STEP_TITLES[step]}</h2>
        </div>
      </div>

      <ol className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${STEP_COUNT}`}>
        {STEP_TITLES.map((title, idx) => {
          const isCurrent = idx === step;
          const isDone = idx < step;
          return (
            <li
              key={title}
              aria-current={isCurrent ? 'step' : undefined}
              className={`h-2.5 rounded-full transition-all border border-brand-blue ${
                isCurrent ? 'w-10 bg-brand-pink'
                : isDone ? 'w-6 bg-brand-blue'
                : 'w-6 bg-brand-pink-tint'
              }`}
            />
          );
        })}
      </ol>
    </section>
  );
}
