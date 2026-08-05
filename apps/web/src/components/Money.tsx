/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { formatINR } from '@/lib/format';
export function Money({ cents }: { cents: number }) {
  return <span className="tabular-nums">{formatINR(cents)}</span>;
}
