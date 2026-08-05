/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { useLogout } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useLoans } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';

export function Dashboard() {
  const me = useMe();
  const apps = useApplications();
  const loans = useLoans();
  const logout = useLogout();
  const nav = useNavigate();

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hi, {me.data?.user.fullName}</h1>
        <div className="flex gap-2">
          <Button onClick={() => nav('/apply')}>Apply for a loan</Button>
          <Button variant="outline" onClick={() => logout.mutate()}>Sign out</Button>
        </div>
      </header>

      <Card>
        <CardHeader><CardTitle>Your applications</CardTitle></CardHeader>
        <CardContent>
          {apps.data?.applications.length === 0 && <p className="text-muted-foreground">No applications yet.</p>}
          <ul className="space-y-2">
            {apps.data?.applications.map((a) => (
              <li key={a.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium"><Money cents={a.amount} /> · {a.termMonths}mo · {(a.annualRateBps / 100).toFixed(2)}%</div>
                  <div className="text-sm text-muted-foreground">{a.purpose} · {formatDate(a.createdAt)}</div>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Your loans</CardTitle></CardHeader>
        <CardContent>
          {loans.data?.loans.length === 0 && <p className="text-muted-foreground">No active loans.</p>}
          <ul className="space-y-2">
            {loans.data?.loans.map((l) => (
              <li key={l.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <Link to={`/loans/${l.id}`} className="font-medium underline"><Money cents={l.principal} /> · {l.termMonths}mo</Link>
                  <div className="text-sm text-muted-foreground">Outstanding: <Money cents={l.outstanding} /></div>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
