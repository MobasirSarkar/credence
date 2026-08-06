/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { UserDTO } from '@lms/shared';

export type MeData = { user: UserDTO | null };

export function useMe() {
  const fetchMe = useCallback(async (): Promise<MeData> => {
    try {
      return await apiFetch<MeData>('/api/auth/me');
    } catch (e) {
      // 401 on /api/auth/me means "no session" — a valid empty state, not an error.
      // Return it as data so React Query transitions out of loading and consumers render.
      const status = (e as Error & { status?: number }).status;
      if (status === 401) return { user: null };
      throw e;
    }
  }, []);

  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 60_000,
  });
}