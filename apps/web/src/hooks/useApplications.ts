/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ApplicationInput, ApplicationDTO } from '@lms/shared';

export function useApplications() {
  const fetchApplications = useCallback(
    () => apiFetch<{ applications: ApplicationDTO[] }>('/api/applications'),
    []
  );

  return useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 10_000,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();

  const createApplicationMutation = useCallback(
    (input: ApplicationInput) =>
      apiFetch<{ application: ApplicationDTO }>('/api/applications', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    []
  );

  const handleSuccess = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['applications'] });
  }, [qc]);

  return useMutation({
    mutationFn: createApplicationMutation,
    onSuccess: handleSuccess,
  });
}
