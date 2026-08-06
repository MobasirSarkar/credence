/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { LogOut, Plus, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';

type AppHeaderUser = {
  fullName: string;
  role: 'applicant' | 'admin';
};

type AppHeaderProps = {
  user?: AppHeaderUser;
  onApply?: () => void;
  onLogout?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};

export function AppHeader({
  user,
  onApply,
  onLogout,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search loans, applications, purpose...',
}: AppHeaderProps) {
  return (
    <header className="border-b-2 border-brand-blue bg-brand-paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center group">
          <BrandLogo size="h-7" />
        </Link>

        {onSearchChange !== undefined && (
          <div className="flex items-center gap-3 flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-blue/60" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-9 rounded-lg border-2 border-brand-blue bg-brand-card pl-9 pr-3 text-xs text-brand-blue font-medium placeholder:text-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-pink riso-shadow-sm"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border-2 border-brand-blue bg-brand-pink-tint text-xs font-mono font-bold text-brand-blue">
              <User className="size-3.5 text-brand-pink" />
              <span>{user.fullName}</span>
              <span className="text-[10px] bg-brand-blue text-white px-1.5 py-0.5 rounded font-mono">
                {user.role === 'admin' ? 'ADMIN' : 'BORROWER'}
              </span>
            </div>
          )}
          {user?.role === 'admin' && (
            <Button size="sm" variant="secondary" render={<Link to="/admin/review" />}>
              Underwriting Review
            </Button>
          )}
          {onApply && (
            <Button size="sm" onClick={onApply}>
              <Plus className="size-4 stroke-[3]" />
              Apply for Loan
            </Button>
          )}
          {onLogout && (
            <Button size="icon-sm" variant="outline" onClick={onLogout} title="Sign out">
              <LogOut className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}