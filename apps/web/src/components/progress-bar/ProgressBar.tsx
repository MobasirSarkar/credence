/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

type ProgressBarProps = {
  /** Percentage 0-100 */
  width: number;
  /** Tailwind class for the filled portion (e.g. "bg-brand-pink"). */
  fillColor: string;
  /** Tailwind class for the empty track (e.g. "bg-brand-pink-tint"). */
  trackColor?: string;
  /** "sm" for stat cards, "md" for repayment progress. */
  size?: 'sm' | 'md';
  /** Aria label for screen readers. */
  label?: string;
};

export function ProgressBar({
  width,
  fillColor,
  trackColor = 'bg-brand-pink-tint',
  size = 'md',
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, width));
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`${height} w-full ${trackColor} rounded-full overflow-hidden border border-brand-blue`}
    >
      <div
        className={`h-full ${fillColor} rounded-full transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}