/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ApplicationRow } from './ApplicationRow';
import type { UnderwritingApplication } from '@/hooks/useUnderwritingReview';

interface UnderwritingTableProps {
  applications: UnderwritingApplication[];
  onReview: (id: string) => void;
}

export function UnderwritingTable({ applications, onReview }: UnderwritingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Tenure</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Income</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <ApplicationRow key={app.id} application={app} onReview={onReview} />
        ))}
      </TableBody>
    </Table>
  );
}
