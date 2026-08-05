/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { useLogout } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useLoans } from '@/hooks/useLoans';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Money } from '@/components/Money';
import { formatDate } from '@/lib/format';
import {
  ArrowRight, FileText, Receipt, TrendingUp, Wallet, Plus, Search,
  LogOut, User
} from 'lucide-react';

export function Dashboard() {
  const me = useMe();
  const apps = useApplications();
  const loans = useLoans();
  const logout = useLogout();
  const nav = useNavigate();

  // Zustand Store for Dashboard state
  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  const userName = me.data?.user.fullName ?? 'Borrower';
  const allLoansList = useMemo(() => loans.data?.loans ?? [], [loans.data?.loans]);
  const allAppsList = useMemo(() => apps.data?.applications ?? [], [apps.data?.applications]);

  const totalDisbursedCents = useMemo(
    () => allLoansList.reduce((sum, l) => sum + l.principal, 0),
    [allLoansList]
  );
  const totalOutstandingCents = useMemo(
    () => allLoansList.reduce((sum, l) => sum + l.outstanding, 0),
    [allLoansList]
  );
  const activeLoansCount = useMemo(
    () => allLoansList.filter((l) => l.status === 'active').length,
    [allLoansList]
  );
  const pendingAppsCount = useMemo(
    () => allAppsList.filter((a) => a.status === 'pending').length,
    [allAppsList]
  );

  const totalLoansCount = allLoansList.length;
  const avgLoanCents = useMemo(
    () => (totalLoansCount > 0 ? Math.round(totalDisbursedCents / totalLoansCount) : 0),
    [totalDisbursedCents, totalLoansCount]
  );

  // Filter applications & loans by search
  const filteredApps = useMemo(
    () =>
      allAppsList.filter(
        (a) =>
          a.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.status.includes(searchQuery.toLowerCase())
      ),
    [allAppsList, searchQuery]
  );

  const filteredLoans = useMemo(
    () =>
      allLoansList.filter(
        (l) =>
          l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.status.includes(searchQuery.toLowerCase())
      ),
    [allLoansList, searchQuery]
  );

  const handleApplyClick = useCallback(() => nav('/apply'), [nav]);
  const handleLogoutClick = useCallback(() => logout.mutate(), [logout]);

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-white pb-20">
      
      {/* Top Operations Header */}
      <header className="border-b-2 border-brand-blue bg-brand-paper sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-pink text-white border-2 border-brand-blue riso-shadow-sm font-extrabold text-base">
                LM
              </span>
              <div className="hidden sm:flex flex-col">
                <span className="font-sans font-extrabold text-base tracking-tight text-brand-blue">
                  LMS<span className="text-brand-pink">.</span>
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-brand-blue/70 -mt-1 font-bold">
                  Operations
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar & User Actions */}
          <div className="flex items-center gap-3 flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-blue/60" />
              <input
                type="text"
                placeholder="Search loans, applications, purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-lg border-2 border-brand-blue bg-brand-card pl-9 pr-3 text-xs text-brand-blue font-medium placeholder:text-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-pink riso-shadow-sm"
              />
            </div>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border-2 border-brand-blue bg-brand-pink-tint text-xs font-mono font-bold text-brand-blue">
              <User className="size-3.5 text-brand-pink" />
              <span>{userName}</span>
              <span className="text-[10px] bg-brand-blue text-white px-1.5 py-0.2 rounded font-mono">
                {me.data?.user.role === 'admin' ? 'ADMIN' : 'BORROWER'}
              </span>
            </div>

            {me.data?.user.role === 'admin' && (
              <Button size="sm" variant="secondary" render={<Link to="/admin" />}>
                Admin Queue
              </Button>
            )}

            <Button size="sm" onClick={handleApplyClick}>
              <Plus className="size-4 stroke-[3]" />
              Apply for Loan
            </Button>

            <Button size="icon-sm" variant="outline" onClick={handleLogoutClick} title="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>

        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="border-t border-brand-blue/20 bg-brand-paper px-6">
          <div className="mx-auto max-w-7xl flex items-center gap-8 text-sm font-bold pt-2 pb-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-brand-pink text-brand-blue font-extrabold'
                  : 'border-transparent text-brand-blue/60 hover:text-brand-blue'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'border-brand-pink text-brand-blue font-extrabold'
                  : 'border-transparent text-brand-blue/60 hover:text-brand-blue'
              }`}
            >
              Applications
              {pendingAppsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-brand-pink text-white font-bold">
                  {pendingAppsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'loans'
                  ? 'border-brand-pink text-brand-blue font-extrabold'
                  : 'border-transparent text-brand-blue/60 hover:text-brand-blue'
              }`}
            >
              Active Loans
              {activeLoansCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-brand-blue text-white font-bold">
                  {activeLoansCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        
        {/* Page Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-blue/70">
              {activeTab === 'overview' ? 'PRODUCTION DASHBOARD' : activeTab === 'applications' ? 'LOAN APPLICATIONS' : 'ACTIVE LOAN PORTFOLIO'}
            </span>
            <h1 className="text-3xl font-extrabold text-brand-blue">
              {activeTab === 'overview' ? `Welcome back, ${userName}` : activeTab === 'applications' ? 'Your Applications' : 'Your Active Loans'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleApplyClick}>
              <Plus className="size-4 text-brand-pink" />
              New Application
            </Button>
          </div>
        </div>

        {/* 4 Riso Stat Cards Grid — SHOWN ONLY ON OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat 1: Total Disbursed */}
            <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-5 riso-shadow relative overflow-hidden">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue/70 block mb-1">
                TOTAL DISBURSED
              </span>
              <div className="text-3xl font-extrabold font-mono text-brand-blue">
                <Money cents={totalDisbursedCents} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-brand-pink">
                <span className="flex items-center gap-1">
                  <TrendingUp className="size-3.5" />
                  {totalLoansCount > 0 ? `${totalLoansCount} loan(s) issued` : 'No loans issued yet'}
                </span>
                {avgLoanCents > 0 && (
                  <span className="text-[10px] font-mono text-brand-blue/70 font-normal">
                    Avg ₹{(avgLoanCents / 100).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="mt-3 h-1.5 w-full bg-brand-pink-tint rounded-full overflow-hidden border border-brand-blue">
                <div
                  className="h-full bg-brand-pink rounded-full transition-all"
                  style={{ width: `${totalLoansCount > 0 ? Math.min(100, totalLoansCount * 25) : 0}%` }}
                />
              </div>
            </div>

            {/* Stat 2: Active Loans */}
            <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-5 riso-shadow relative overflow-hidden">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue/70 block mb-1">
                ACTIVE LOANS
              </span>
              <div className="text-3xl font-extrabold font-mono text-brand-blue">
                {activeLoansCount}
              </div>
              <div className="mt-3 text-xs font-bold text-brand-blue/80">
                {activeLoansCount > 0 ? `${activeLoansCount} active repayment schedule(s)` : 'No active loans'}
              </div>
              <div className="mt-3 h-1.5 w-full bg-brand-blue-tint rounded-full overflow-hidden border border-brand-blue">
                <div className="h-full bg-brand-blue w-1/2 rounded-full" />
              </div>
            </div>

            {/* Stat 3: Outstanding Principal */}
            <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-5 riso-shadow relative overflow-hidden">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue/70 block mb-1">
                OUTSTANDING PRINCIPAL
              </span>
              <div className="text-3xl font-extrabold font-mono text-brand-blue">
                <Money cents={totalOutstandingCents} />
              </div>
              <div className="mt-3 text-xs font-bold text-brand-blue/80">
                {totalDisbursedCents > 0
                  ? `${Math.round(((totalDisbursedCents - totalOutstandingCents) / totalDisbursedCents) * 100)}% repaid so far`
                  : 'Zero balance'}
              </div>
              <div className="mt-3 h-1.5 w-full bg-brand-paper rounded-full overflow-hidden border border-brand-blue">
                <div
                  className="h-full bg-brand-pink rounded-full transition-all"
                  style={{
                    width: `${totalDisbursedCents > 0 ? Math.round(((totalDisbursedCents - totalOutstandingCents) / totalDisbursedCents) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Stat 4: Pending Approvals */}
            <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-5 riso-shadow relative overflow-hidden">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue/70 block mb-1">
                PENDING APPLICATIONS
              </span>
              <div className="text-3xl font-extrabold font-mono text-brand-blue">
                {pendingAppsCount}
              </div>
              <div className="mt-3 text-xs font-bold text-brand-blue/80">
                {pendingAppsCount > 0 ? 'Underwriting rule evaluating' : 'All applications processed'}
              </div>
              <div className="mt-3 h-1.5 w-full bg-brand-pink-tint rounded-full overflow-hidden border border-brand-blue">
                <div className="h-full bg-brand-blue w-2/3 rounded-full" />
              </div>
            </div>

          </div>
        )}

        {/* Section: Your Applications (Shown on Overview or Applications tab) */}
        {(activeTab === 'overview' || activeTab === 'applications') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-brand-pink" />
                <h2 className="text-xl font-extrabold text-brand-blue">Your Loan Applications</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-pink-tint text-brand-blue border border-brand-blue">
                  {filteredApps.length}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={handleApplyClick}>
                + New Application
              </Button>
            </div>

            {filteredApps.length === 0 ? (
              <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-10 text-center riso-shadow">
                <FileText className="mx-auto size-12 text-brand-blue/40 mb-3" />
                <h3 className="text-lg font-bold text-brand-blue">No loan applications found</h3>
                <p className="text-sm text-brand-blue/70 font-medium max-w-sm mx-auto mt-1 mb-5">
                  Apply in under 2 minutes with instant FOIR evaluation and zero branch visits.
                </p>
                <Button onClick={handleApplyClick}>
                  Apply for Your First Loan
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApps.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border-2 border-brand-blue bg-brand-card p-5 riso-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-brand-blue/60 uppercase tracking-wider block">
                            APPLICATION #{a.id.slice(0, 8)}
                          </span>
                          <h4 className="text-xl font-extrabold font-mono text-brand-blue">
                            <Money cents={a.amount} />
                          </h4>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-brand-paper p-3 rounded-lg border border-brand-blue/30 mb-3">
                        <div>
                          <span className="text-brand-blue/60 block text-[10px]">TENURE</span>
                          <span>{a.termMonths} Months</span>
                        </div>
                        <div>
                          <span className="text-brand-blue/60 block text-[10px]">INTEREST RATE</span>
                          <span>{(a.annualRateBps / 100).toFixed(2)}% APR</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-brand-blue/10">
                          <span className="text-brand-blue/60 block text-[10px]">PURPOSE</span>
                          <span className="capitalize">{a.purpose}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs font-mono font-bold border-t border-brand-blue/20">
                      <span className="text-brand-blue/70">Submitted {formatDate(a.createdAt)}</span>
                      {a.status === 'disbursed' && (
                        <Link to={`/loans/${a.id}`} className="text-brand-pink hover:underline flex items-center gap-1 font-bold">
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

        {/* Section: Your Active Loans (Shown on Overview or Loans tab) */}
        {(activeTab === 'overview' || activeTab === 'loans') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="size-5 text-brand-blue" />
                <h2 className="text-xl font-extrabold text-brand-blue">Active Loan Lifecycle</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-blue-tint text-brand-blue border border-brand-blue">
                  {filteredLoans.length}
                </span>
              </div>
            </div>

            {filteredLoans.length === 0 ? (
              <div className="rounded-xl border-2 border-brand-blue bg-brand-card p-10 text-center riso-shadow">
                <Wallet className="mx-auto size-12 text-brand-blue/40 mb-3" />
                <h3 className="text-lg font-bold text-brand-blue">No active loans yet</h3>
                <p className="text-sm text-brand-blue/70 font-medium max-w-sm mx-auto mt-1 mb-5">
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
                      className="rounded-xl border-2 border-brand-blue bg-brand-card p-5 riso-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-brand-blue/60 uppercase tracking-wider block">
                              LOAN ID #{l.id.slice(0, 8)}
                            </span>
                            <h4 className="text-xl font-extrabold font-mono text-brand-blue">
                              <Money cents={l.principal} />
                            </h4>
                          </div>
                          <StatusBadge status={l.status} />
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-xs font-mono font-bold">
                            <span className="text-brand-blue">Repayment Progress</span>
                            <span className="text-brand-pink">{percentPaid}% Paid</span>
                          </div>
                          <div className="h-2.5 w-full bg-brand-pink-tint rounded-full overflow-hidden border border-brand-blue">
                            <div
                              className="h-full bg-brand-pink rounded-full transition-all duration-300"
                              style={{ width: `${percentPaid}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-brand-paper p-3 rounded-lg border border-brand-blue/30 mb-3">
                          <div>
                            <span className="text-brand-blue/60 block text-[10px]">OUTSTANDING</span>
                            <span className="text-brand-pink font-bold"><Money cents={l.outstanding} /></span>
                          </div>
                          <div>
                            <span className="text-brand-blue/60 block text-[10px]">TENURE / RATE</span>
                            <span>{l.termMonths}m @ {(l.annualRateBps / 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-brand-blue/20">
                        <span className="text-xs font-mono font-bold text-brand-blue/70">
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
