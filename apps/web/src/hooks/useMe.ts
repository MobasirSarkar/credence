/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { UserDTO } from '@lms/shared';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<{ user: UserDTO }>('/api/auth/me'),
    retry: false,
    staleTime: 60_000,
  });
}
