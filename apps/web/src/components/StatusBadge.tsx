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

const badgeClasses: Record<string, string> = {
  pending: 'bg-[#FDE8F3] text-[#2C40A7] border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]',
  approved: 'bg-[#F237A1] text-white border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]',
  disbursed: 'bg-[#F237A1] text-white border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]',
  active: 'bg-[#2C40A7] text-white border-2 border-[#2C40A7] shadow-[2px_2px_0px_#F237A1]',
  rejected: 'bg-[#DC2626] text-white border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]',
  closed: 'bg-[#FFFDF8] text-[#2C40A7] border-2 border-[#2C40A7]',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = badgeClasses[status] ?? 'bg-[#FAF7F0] text-[#2C40A7] border-2 border-[#2C40A7]';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide ${cls}`}>
      {labels[status] ?? status}
    </span>
  );
}
