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
import { ArrowLeft, CircleAlert, Loader2, Receipt, TrendingUp, Wallet, Check } from 'lucide-react';

export function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const q = useLoan(id);
  const pay = usePayInstallment(id ?? '');

  if (q.isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-6 py-20 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" /> Loading loan
        </div>
      </main>
    );
  }

  if (q.error || !q.data) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 py-20 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleAlert className="size-5" />
          </span>
          <p className="text-sm text-destructive">Could not load loan.</p>
          <Button variant="outline" size="sm" render={<Link to="/dashboard" />}>
            <ArrowLeft /> Back to dashboard
          </Button>
        </div>
      </main>
    );
  }

  const { loan, installments } = q.data;
  const next = installments.find((i) => !i.paidAt);
  const paid = installments.filter((i) => i.paidAt).length;
  const total = installments.length;
  const progress = total > 0 ? (paid / total) * 100 : 0;
  const paidSoFar = loan.principal - loan.outstanding;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Button variant="ghost" size="sm" render={<Link to="/dashboard" />}>
            <ArrowLeft />
            Dashboard
          </Button>
          <StatusBadge status={loan.status} />
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Receipt className="size-4 text-muted-foreground" />
              Loan summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Summary label="Principal" value={<Money cents={loan.principal} />} icon={Wallet} />
              <Summary label="Outstanding" value={<Money cents={loan.outstanding} />} icon={TrendingUp} />
              <Summary label="Paid so far" value={<Money cents={paidSoFar} />} icon={Check} />
              <Summary label="Monthly EMI" value={<Money cents={Math.round((loan.principal / Math.max(1, loan.termMonths)))} />} icon={Receipt} />
            </div>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between sm:block">
                <dt className="text-muted-foreground">Rate</dt>
                <dd className="font-medium tabular-nums">{(loan.annualRateBps / 100).toFixed(2)}% APR</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-muted-foreground">Term</dt>
                <dd className="font-medium tabular-nums">{loan.termMonths} months</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-muted-foreground">Start</dt>
                <dd className="font-medium">{formatDate(loan.startDate)}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-muted-foreground">End</dt>
                <dd className="font-medium">{formatDate(loan.endDate)}</dd>
              </div>
            </dl>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Repayment progress</span>
                <span className="tabular-nums">{paid} of {total} installments</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress.toFixed(1)}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Installments</CardTitle>
          </CardHeader>
          <CardContent>
            {installments.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No installments scheduled.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((i) => {
                    const isNext = next?.id === i.id && loan.status === 'active';
                    return (
                      <TableRow key={i.id} className={isNext ? 'bg-muted/50' : undefined}>
                        <TableCell className="tabular-nums">{i.sequence}</TableCell>
                        <TableCell>{formatDate(i.dueDate)}</TableCell>
                        <TableCell><Money cents={i.principalDue} /></TableCell>
                        <TableCell><Money cents={i.interestDue} /></TableCell>
                        <TableCell>
                          {i.paidAt ? (
                            <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400">
                              <Check className="size-3.5" /> Paid {formatDate(i.paidAt)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Due</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isNext && (
                            <Button
                              size="sm"
                              disabled={pay.isPending}
                              onClick={() =>
                                pay.mutate(i.sequence, {
                                  onError: (e) => toast.error((e as Error).message),
                                  onSuccess: () => toast.success('EMI paid'),
                                })
                              }
                            >
                              {pay.isPending ? <Loader2 className="animate-spin" /> : null}
                              Pay EMI
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Summary({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: typeof Wallet;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
