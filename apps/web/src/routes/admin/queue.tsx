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
import { ArrowLeft, CircleAlert, FileText, Loader2, ShieldCheck } from 'lucide-react';

export function AdminQueue() {
  const q = useAdminApplications('pending');
  const logout = useLogout();
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" render={<Link to="/dashboard" aria-label="Back" />}>
              <ArrowLeft />
            </Button>
            <div>
              <p className="text-xs text-muted-foreground">Admin</p>
              <h1 className="text-lg font-semibold leading-tight">Pending applications</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Admin mode
            </span>
            <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
              {logout.isPending ? <Loader2 className="animate-spin" /> : null}
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-3 px-6 py-8">
        <p className="text-sm text-muted-foreground">
          {q.data ? `${q.data.applications.length} application(s) waiting for review.` : 'Loading queue.'}
        </p>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {q.isLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading
              </div>
            ) : q.error ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
                <CircleAlert className="size-4" /> Could not load queue
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {q.data?.applications.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="font-medium">{a.applicant.fullName}</div>
                        <div className="text-xs text-muted-foreground">{a.applicant.email}</div>
                      </TableCell>
                      <TableCell><Money cents={a.amount} /></TableCell>
                      <TableCell>{a.termMonths}mo</TableCell>
                      <TableCell>{(a.annualRateBps / 100).toFixed(2)}%</TableCell>
                      <TableCell>{formatDate(a.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" render={<Link to={`/admin/applications/${a.id}`} />}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {q.data?.applications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center">
                        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <FileText className="size-4" />
                          </span>
                          <p>No pending applications.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
