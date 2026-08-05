/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Badge } from '@/components/ui/badge';

const labels: Record<string, string> = {
  pending: 'Pending', approved: 'Approved', rejected: 'Rejected', disbursed: 'Disbursed',
  active: 'Active', closed: 'Closed',
};
const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary', approved: 'default', rejected: 'destructive', disbursed: 'default',
  active: 'default', closed: 'outline',
};
export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={variants[status] ?? 'outline'}>{labels[status] ?? status}</Badge>;
}
