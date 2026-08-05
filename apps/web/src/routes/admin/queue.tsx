/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { useAdminApplications } from '@/hooks/useAdmin';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';

export function AdminQueue() {
  const q = useAdminApplications('pending');
  const logout = useLogout();
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — pending applications</h1>
        <Button variant="outline" onClick={() => logout.mutate()}>Sign out</Button>
      </header>
      <Card>
        <CardHeader><CardTitle>Queue</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Applicant</TableHead><TableHead>Amount</TableHead>
              <TableHead>Term</TableHead><TableHead>Rate</TableHead>
              <TableHead>Submitted</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {q.data?.applications.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.applicant.fullName} ({a.applicant.email})</TableCell>
                  <TableCell><Money cents={a.amount} /></TableCell>
                  <TableCell>{a.termMonths}mo</TableCell>
                  <TableCell>{(a.annualRateBps / 100).toFixed(2)}%</TableCell>
                  <TableCell>{formatDate(a.createdAt)}</TableCell>
                  <TableCell><Button size="sm" render={<Link to={`/admin/applications/${a.id}`} />}>Review</Button></TableCell>
                </TableRow>
              ))}
              {q.data?.applications.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-muted-foreground text-center">No pending applications.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
