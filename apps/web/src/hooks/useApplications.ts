/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ApplicationInput, ApplicationDTO } from '@lms/shared';

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => apiFetch<{ applications: ApplicationDTO[] }>('/api/applications'),
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplicationInput) =>
      apiFetch<{ application: ApplicationDTO }>('/api/applications', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}
