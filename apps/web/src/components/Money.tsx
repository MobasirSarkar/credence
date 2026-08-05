/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { formatINR } from '@/lib/format';
export function Money({ cents, className = '' }: { cents: number; className?: string }) {
  return <span className={`tabular-nums font-mono font-bold ${className}`}>{formatINR(cents)}</span>;
}
