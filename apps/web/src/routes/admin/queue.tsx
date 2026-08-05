/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAdminApplications } from '@/hooks/useAdmin';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import { ArrowLeft, CircleAlert, FileText, Loader2, ShieldCheck, ArrowRight, User } from 'lucide-react';

export function AdminQueue() {
  const q = useAdminApplications('pending');
  const logout = useLogout();
  const nav = useNavigate();

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans selection:bg-[#F237A1] selection:text-white pb-20">
      
      {/* Top Admin Header */}
      <header className="border-b-2 border-[#2C40A7] bg-[#FAF7F0] sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" render={<Link to="/dashboard" />}>
              <ArrowLeft className="size-4 stroke-[2.5]" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2 border-l-2 border-[#2C40A7]/20 pl-3">
              <ShieldCheck className="size-5 text-[#F237A1]" />
              <span className="font-extrabold text-base">Underwriter Desk</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F237A1] text-white border border-[#2C40A7]">
              ADMIN ROLE
            </span>
            <Button size="sm" variant="outline" onClick={() => logout.mutate()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 pt-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#2C40A7]/20 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2C40A7]/70">
              UNDERWRITING QUEUE
            </span>
            <h1 className="text-3xl font-extrabold text-[#2C40A7]">
              Pending Loan Applications
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FDE8F3] text-[#2C40A7] border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]">
            {q.data ? `${q.data.applications.length} Pending Review` : 'Loading...'}
          </span>
        </div>

        {q.isLoading ? (
          <div className="p-12 text-center font-mono text-xs font-bold">
            <Loader2 className="size-8 animate-spin text-[#F237A1] mx-auto mb-2" />
            Fetching pending queue...
          </div>
        ) : q.error || !q.data ? (
          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-8 text-center shadow-[4px_4px_0px_#2C40A7]">
            <CircleAlert className="size-10 text-[#DC2626] mx-auto mb-2" />
            <p className="text-sm font-bold">Failed to load admin queue.</p>
          </div>
        ) : q.data.applications.length === 0 ? (
          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-10 text-center shadow-[4px_4px_0px_#2C40A7]">
            <FileText className="size-12 text-[#2C40A7]/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#2C40A7]">No pending applications in queue</h3>
            <p className="text-sm text-[#2C40A7]/70 font-medium max-w-sm mx-auto mt-1">
              All submitted loan applications have been evaluated or decided.
            </p>
          </div>
        ) : (
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
              {q.data.applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-[#F237A1]" />
                      <div>
                        <div>{app.applicant.fullName}</div>
                        <div className="text-xs text-[#2C40A7]/60 font-mono font-normal">{app.applicant.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-extrabold text-[#F237A1]">
                    <Money cents={app.amount} />
                  </TableCell>
                  <TableCell className="font-mono font-bold">{app.termMonths}m</TableCell>
                  <TableCell className="font-mono font-bold">{(app.annualRateBps / 100).toFixed(2)}%</TableCell>
                  <TableCell className="font-mono font-bold">
                    {app.applicant.monthlyIncome ? <Money cents={app.applicant.monthlyIncome} /> : '—'}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{formatDate(app.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="xs" onClick={() => nav(`/admin/applications/${app.id}`)}>
                      Review Application
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

      </div>
    </main>
  );
}
