/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link, useParams } from 'react-router-dom';
import { useLoan, usePayInstallment } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/StatusBadge';

export function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const q = useLoan(id);
  const pay = usePayInstallment(id ?? '');
  if (!q.data) return <main className="p-6">Loading…</main>;
  const { loan, installments } = q.data;
  const next = installments.find((i) => !i.paidAt);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto space-y-4">
      <Link to="/dashboard" className="text-sm underline">← Back</Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loan — <Money cents={loan.principal} /></CardTitle>
          <StatusBadge status={loan.status} />
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Start: {formatDate(loan.startDate)} · End: {formatDate(loan.endDate)}</p>
          <p>Rate: {(loan.annualRateBps / 100).toFixed(2)}% · Outstanding: <Money cents={loan.outstanding} /></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Installments</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>#</TableHead><TableHead>Due</TableHead>
              <TableHead>Principal</TableHead><TableHead>Interest</TableHead>
              <TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {installments.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.sequence}</TableCell>
                  <TableCell>{formatDate(i.dueDate)}</TableCell>
                  <TableCell><Money cents={i.principalDue} /></TableCell>
                  <TableCell><Money cents={i.interestDue} /></TableCell>
                  <TableCell>{i.paidAt ? <span className="text-green-700">Paid {formatDate(i.paidAt)}</span> : <span className="text-muted-foreground">Due</span>}</TableCell>
                  <TableCell>
                    {!i.paidAt && next?.id === i.id && loan.status === 'active' && (
                      <Button size="sm" disabled={pay.isPending} onClick={() => pay.mutate(i.sequence, { onError: (e) => toast.error((e as Error).message) })}>Pay EMI</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
