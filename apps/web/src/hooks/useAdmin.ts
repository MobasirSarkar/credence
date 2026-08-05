/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ApplicationDTO, DecisionInput, LoanDTO, InstallmentDTO } from '@lms/shared';

export function useAdminApplications(status: 'pending' | 'approved' | 'rejected' | 'disbursed' = 'pending') {
  const fetchAdminApplications = useCallback(
    () => apiFetch<{ applications: (ApplicationDTO & { applicant: { id: string; email: string; fullName: string; monthlyIncome?: number } })[] }>(`/api/admin/applications?status=${status}`),
    [status]
  );

  return useQuery({
    queryKey: ['admin', 'applications', status],
    queryFn: fetchAdminApplications,
    staleTime: 10_000,
  });
}

export function useDecideApplication() {
  const qc = useQueryClient();

  const decideMutation = useCallback(
    ({ id, input }: { id: string; input: DecisionInput }) =>
      apiFetch<{ application: ApplicationDTO }>(`/api/admin/applications/${id}/decision`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    []
  );

  const handleSuccess = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['admin', 'applications'] });
    qc.invalidateQueries({ queryKey: ['applications'] });
  }, [qc]);

  return useMutation({
    mutationFn: decideMutation,
    onSuccess: handleSuccess,
  });
}

export function useDisburse() {
  const qc = useQueryClient();

  const disburseMutation = useCallback(
    (id: string) =>
      apiFetch<{ loan: LoanDTO; installments: InstallmentDTO[] }>(`/api/admin/applications/${id}/disburse`, {
        method: 'POST',
      }),
    []
  );

  const handleSuccess = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['admin', 'applications'] });
    qc.invalidateQueries({ queryKey: ['loans'] });
  }, [qc]);

  return useMutation({
    mutationFn: disburseMutation,
    onSuccess: handleSuccess,
  });
}
