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
      className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-4 shadow-[3.5px_3.5px_0px_#2C40A7] flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-lg bg-[#2C40A7] text-white font-mono font-bold text-sm"
        >
          {step + 1}
        </span>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block">
            STEP {step + 1} OF {STEP_COUNT}
          </span>
          <h2 className="text-lg font-extrabold text-[#2C40A7]">{STEP_TITLES[step]}</h2>
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
              className={`h-2.5 rounded-full transition-all border border-[#2C40A7] ${
                isCurrent ? 'w-10 bg-[#F237A1]'
                : isDone ? 'w-6 bg-[#2C40A7]'
                : 'w-6 bg-[#FDE8F3]'
              }`}
            />
          );
        })}
      </ol>
    </section>
  );
}
