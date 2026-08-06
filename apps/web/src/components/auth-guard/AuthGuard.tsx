/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import type { ReactNode } from 'react';

export function AuthGuard({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { data, isLoading } = useMe();
  const loc = useLocation();
  if (isLoading) return null;
  if (!data || !data.user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && data.user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}