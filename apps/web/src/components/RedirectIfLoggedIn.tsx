/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';

/** Redirects to /dashboard if the user is already authenticated. */
export function RedirectIfLoggedIn() {
  const { data, isLoading } = useMe();
  const nav = useNavigate();
  useEffect(() => {
    if (!isLoading && data?.user) {
      nav(data.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [data, isLoading, nav]);
  return null;
}