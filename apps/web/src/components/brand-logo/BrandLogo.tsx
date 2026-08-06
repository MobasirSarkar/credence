/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

type BrandLogoProps = {
  /** Total height in Tailwind classes, e.g. "h-10" or "h-12". Width scales with SVG aspect ratio. */
  size?: 'h-6' | 'h-7' | 'h-8' | 'h-9' | 'h-10' | 'h-12' | 'h-16';
  className?: string;
};

export function BrandLogo({ size = 'h-10', className = '' }: BrandLogoProps) {
  return (
    <img
      src="/main_icon.svg"
      alt="LMS"
      className={`${size} w-auto ${className}`.trim()}
    />
  );
}