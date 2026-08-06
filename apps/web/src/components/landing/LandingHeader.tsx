/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo/BrandLogo';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#calculator', label: 'Calculator' },
  { href: '#process', label: 'How it Works' },
  { href: '#faq', label: 'FAQ' },
] as const;

interface LandingHeaderProps {
  isLoggedIn: boolean;
}

export function LandingHeader({ isLoggedIn }: LandingHeaderProps) {
  return (
    <header className="border-b-2 border-brand-blue bg-brand-paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center group">
          <BrandLogo size="h-10" />
        </Link>

        <nav
          aria-label="Marketing sections"
          className="hidden md:flex items-center gap-8 text-sm font-bold"
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-brand-pink transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button size="sm" render={<Link to="/dashboard" />}>
              Go to Dashboard
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold px-3 py-1.5 hover:text-brand-pink transition-colors"
              >
                Log in
              </Link>
              <Button size="sm" render={<Link to="/signup" />}>
                Apply for Loan
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
