/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { useLogout } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useLoans } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import {
  ArrowRight, FileText, Receipt, TrendingUp, Wallet, Plus, Search,
  Bell, LogOut, CheckCircle2, ShieldCheck, Clock, User
} from 'lucide-react';
import type { ApplicationDTO, LoanDTO } from '@lms/shared';

export function Dashboard() {
  const me = useMe();
  const apps = useApplications();
  const loans = useLoans();
  const logout = useLogout();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'loans'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const userName = me.data?.user.fullName ?? 'Borrower';
  const isPendingLoading = apps.isLoading || loans.isLoading;

  const totalDisbursedCents = (loans.data?.loans ?? []).reduce((sum, l) => sum + l.principal, 0);
  const totalOutstandingCents = (loans.data?.loans ?? []).reduce((sum, l) => sum + l.outstanding, 0);
  const activeLoansCount = (loans.data?.loans ?? []).filter((l) => l.status === 'active').length;
  const pendingAppsCount = (apps.data?.applications ?? []).filter((a) => a.status === 'pending').length;

  // Filter applications & loans by search
  const filteredApps = (apps.data?.applications ?? []).filter(
    (a) => a.purpose.toLowerCase().includes(searchQuery.toLowerCase()) || a.status.includes(searchQuery.toLowerCase())
  );
  const filteredLoans = (loans.data?.loans ?? []).filter(
    (l) => l.id.toLowerCase().includes(searchQuery.toLowerCase()) || l.status.includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#2C40A7] font-sans selection:bg-[#F237A1] selection:text-white pb-20">
      
      {/* Top Operations Header (Matching Image #1) */}
      <header className="border-b-2 border-[#2C40A7] bg-[#FAF7F0] sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#F237A1] text-white border-2 border-[#2C40A7] shadow-[2px_2px_0px_#2C40A7] font-extrabold text-base">
                LM
              </span>
              <div className="hidden sm:flex flex-col">
                <span className="font-sans font-extrabold text-base tracking-tight text-[#2C40A7]">
                  LMS<span className="text-[#F237A1]">.</span>
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#2C40A7]/70 -mt-1 font-bold">
                  Operations
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar & User Actions */}
          <div className="flex items-center gap-3 flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#2C40A7]/60" />
              <input
                type="text"
                placeholder="Search loans, applications, purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-lg border-2 border-[#2C40A7] bg-[#FFFDF8] pl-9 pr-3 text-xs text-[#2C40A7] font-medium placeholder:text-[#2C40A7]/50 focus:outline-none focus:ring-2 focus:ring-[#F237A1] focus:shadow-[2px_2px_0px_#2C40A7]"
              />
            </div>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#2C40A7] bg-[#FDE8F3] text-xs font-mono font-bold text-[#2C40A7]">
              <User className="size-3.5 text-[#F237A1]" />
              <span>{userName}</span>
              <span className="text-[10px] bg-[#2C40A7] text-white px-1.5 py-0.2 rounded font-mono">
                {me.data?.user.role === 'admin' ? 'ADMIN' : 'BORROWER'}
              </span>
            </div>

            {me.data?.user.role === 'admin' && (
              <Button size="sm" variant="secondary" render={<Link to="/admin" />}>
                Admin Queue
              </Button>
            )}

            <Button size="sm" onClick={() => nav('/apply')}>
              <Plus className="size-4 stroke-[3]" />
              Apply for Loan
            </Button>

            <Button size="icon-sm" variant="outline" onClick={() => logout.mutate()} title="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>

        </div>

        {/* Sub-Header Navigation Tabs (Matching Image #1) */}
        <div className="border-t border-[#2C40A7]/20 bg-[#FAF7F0] px-6">
          <div className="mx-auto max-w-7xl flex items-center gap-8 text-sm font-bold pt-2 pb-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#F237A1] text-[#2C40A7] font-extrabold'
                  : 'border-transparent text-[#2C40A7]/60 hover:text-[#2C40A7]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'border-[#F237A1] text-[#2C40A7] font-extrabold'
                  : 'border-transparent text-[#2C40A7]/60 hover:text-[#2C40A7]'
              }`}
            >
              Applications
              {pendingAppsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-[#F237A1] text-white font-bold">
                  {pendingAppsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'loans'
                  ? 'border-[#F237A1] text-[#2C40A7] font-extrabold'
                  : 'border-transparent text-[#2C40A7]/60 hover:text-[#2C40A7]'
              }`}
            >
              Active Loans
              {activeLoansCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-[#2C40A7] text-white font-bold">
                  {activeLoansCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2C40A7]/70">
              PRODUCTION DASHBOARD
            </span>
            <h1 className="text-3xl font-extrabold text-[#2C40A7]">
              Welcome back, {userName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => nav('/apply')}>
              <Plus className="size-4 text-[#F237A1]" />
              New Application
            </Button>
          </div>
        </div>

        {/* 4 Riso Stat Cards Grid (Matching Image #1 layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Stat 1: Total Disbursed */}
          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7] relative overflow-hidden">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              TOTAL DISBURSED
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#2C40A7]">
              <Money cents={totalDisbursedCents} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#F237A1]">
              <span className="flex items-center gap-1">
                <TrendingUp className="size-3.5" />
                +12% vs last month
              </span>
            </div>
            {/* Sparkline decoration (Riso Pink line matching Image #1) */}
            <div className="mt-3 h-1.5 w-full bg-[#FDE8F3] rounded-full overflow-hidden border border-[#2C40A7]">
              <div className="h-full bg-[#F237A1] w-3/4 rounded-full" />
            </div>
          </div>

          {/* Stat 2: Active Loans */}
          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7] relative overflow-hidden">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              ACTIVE LOANS
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#2C40A7]">
              {activeLoansCount}
            </div>
            <div className="mt-3 text-xs font-bold text-[#2C40A7]/80">
              {activeLoansCount > 0 ? `${activeLoansCount} active repayment schedule` : 'No active loans'}
            </div>
            <div className="mt-3 h-1.5 w-full bg-[#EEF2FF] rounded-full overflow-hidden border border-[#2C40A7]">
              <div className="h-full bg-[#2C40A7] w-1/2 rounded-full" />
            </div>
          </div>

          {/* Stat 3: Outstanding Principal */}
          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7] relative overflow-hidden">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              OUTSTANDING PRINCIPAL
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#2C40A7]">
              <Money cents={totalOutstandingCents} />
            </div>
            <div className="mt-3 text-xs font-bold text-[#2C40A7]/80">
              {totalDisbursedCents > 0
                ? `${Math.round(((totalDisbursedCents - totalOutstandingCents) / totalDisbursedCents) * 100)}% repaid so far`
                : 'Zero balance'}
            </div>
            <div className="mt-3 h-1.5 w-full bg-[#FAF7F0] rounded-full overflow-hidden border border-[#2C40A7]">
              <div
                className="h-full bg-[#F237A1] rounded-full"
                style={{
                  width: `${totalDisbursedCents > 0 ? Math.round(((totalDisbursedCents - totalOutstandingCents) / totalDisbursedCents) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Stat 4: Pending Approvals */}
          <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[4px_4px_0px_#2C40A7] relative overflow-hidden">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2C40A7]/70 block mb-1">
              PENDING APPLICATIONS
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#2C40A7]">
              {pendingAppsCount}
            </div>
            <div className="mt-3 text-xs font-bold text-[#2C40A7]/80">
              {pendingAppsCount > 0 ? 'Underwriting rule evaluating' : 'All applications processed'}
            </div>
            <div className="mt-3 h-1.5 w-full bg-[#FDE8F3] rounded-full overflow-hidden border border-[#2C40A7]">
              <div className="h-full bg-[#2C40A7] w-2/3 rounded-full" />
            </div>
          </div>

        </div>

        {/* Section: Your Applications */}
        {(activeTab === 'overview' || activeTab === 'applications') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-[#F237A1]" />
                <h2 className="text-xl font-extrabold text-[#2C40A7]">Your Loan Applications</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FDE8F3] text-[#2C40A7] border border-[#2C40A7]">
                  {filteredApps.length}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => nav('/apply')}>
                + New Application
              </Button>
            </div>

            {filteredApps.length === 0 ? (
              <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-10 text-center shadow-[4px_4px_0px_#2C40A7]">
                <FileText className="mx-auto size-12 text-[#2C40A7]/40 mb-3" />
                <h3 className="text-lg font-bold text-[#2C40A7]">No loan applications found</h3>
                <p className="text-sm text-[#2C40A7]/70 font-medium max-w-sm mx-auto mt-1 mb-5">
                  Apply in under 2 minutes with instant FOIR evaluation and zero branch visits.
                </p>
                <Button onClick={() => nav('/apply')}>
                  Apply for Your First Loan
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApps.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[3.5px_3.5px_0px_#2C40A7] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#2C40A7]/60 uppercase tracking-wider block">
                            APPLICATION #{a.id.slice(0, 8)}
                          </span>
                          <h4 className="text-xl font-extrabold font-mono text-[#2C40A7]">
                            <Money cents={a.amount} />
                          </h4>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-[#FAF7F0] p-3 rounded-lg border border-[#2C40A7]/30 mb-3">
                        <div>
                          <span className="text-[#2C40A7]/60 block text-[10px]">TENURE</span>
                          <span>{a.termMonths} Months</span>
                        </div>
                        <div>
                          <span className="text-[#2C40A7]/60 block text-[10px]">INTEREST RATE</span>
                          <span>{(a.annualRateBps / 100).toFixed(2)}% APR</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-[#2C40A7]/10">
                          <span className="text-[#2C40A7]/60 block text-[10px]">PURPOSE</span>
                          <span className="capitalize">{a.purpose}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs font-mono font-bold border-t border-[#2C40A7]/20">
                      <span className="text-[#2C40A7]/70">Submitted {formatDate(a.createdAt)}</span>
                      {a.status === 'disbursed' && (
                        <Link to={`/loans/${a.id}`} className="text-[#F237A1] hover:underline flex items-center gap-1 font-bold">
                          View Active Loan <ArrowRight className="size-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section: Your Active Loans */}
        {(activeTab === 'overview' || activeTab === 'loans') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="size-5 text-[#2C40A7]" />
                <h2 className="text-xl font-extrabold text-[#2C40A7]">Active Loan Lifecycle</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EEF2FF] text-[#2C40A7] border border-[#2C40A7]">
                  {filteredLoans.length}
                </span>
              </div>
            </div>

            {filteredLoans.length === 0 ? (
              <div className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-10 text-center shadow-[4px_4px_0px_#2C40A7]">
                <Wallet className="mx-auto size-12 text-[#2C40A7]/40 mb-3" />
                <h3 className="text-lg font-bold text-[#2C40A7]">No active loans yet</h3>
                <p className="text-sm text-[#2C40A7]/70 font-medium max-w-sm mx-auto mt-1 mb-5">
                  Once your application is approved and disbursed by the underwriter, your loan schedule will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLoans.map((l) => {
                  const percentPaid = Math.round(((l.principal - l.outstanding) / l.principal) * 100);
                  return (
                    <div
                      key={l.id}
                      className="rounded-xl border-2 border-[#2C40A7] bg-[#FFFDF8] p-5 shadow-[3.5px_3.5px_0px_#2C40A7] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#2C40A7]/60 uppercase tracking-wider block">
                              LOAN ID #{l.id.slice(0, 8)}
                            </span>
                            <h4 className="text-xl font-extrabold font-mono text-[#2C40A7]">
                              <Money cents={l.principal} />
                            </h4>
                          </div>
                          <StatusBadge status={l.status} />
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-xs font-mono font-bold">
                            <span className="text-[#2C40A7]">Repayment Progress</span>
                            <span className="text-[#F237A1]">{percentPaid}% Paid</span>
                          </div>
                          <div className="h-2.5 w-full bg-[#FDE8F3] rounded-full overflow-hidden border border-[#2C40A7]">
                            <div
                              className="h-full bg-[#F237A1] rounded-full transition-all duration-300"
                              style={{ width: `${percentPaid}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-[#FAF7F0] p-3 rounded-lg border border-[#2C40A7]/30 mb-3">
                          <div>
                            <span className="text-[#2C40A7]/60 block text-[10px]">OUTSTANDING</span>
                            <span className="text-[#F237A1] font-bold"><Money cents={l.outstanding} /></span>
                          </div>
                          <div>
                            <span className="text-[#2C40A7]/60 block text-[10px]">TENURE / RATE</span>
                            <span>{l.termMonths}m @ {(l.annualRateBps / 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#2C40A7]/20">
                        <span className="text-xs font-mono font-bold text-[#2C40A7]/70">
                          Start: {formatDate(l.startDate)}
                        </span>
                        <Link to={`/loans/${l.id}`}>
                          <Button size="sm">
                            Manage & Pay EMI
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
