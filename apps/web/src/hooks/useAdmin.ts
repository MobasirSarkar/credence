/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ApplicationDTO, DecisionInput, LoanDTO, InstallmentDTO } from '@lms/shared';

export function useAdminApplications(status: 'pending' | 'approved' | 'rejected' | 'disbursed' = 'pending') {
  return useQuery({
    queryKey: ['admin', 'applications', status],
    queryFn: () => apiFetch<{ applications: (ApplicationDTO & { applicant: { id: string; email: string; fullName: string } })[] }>(`/api/admin/applications?status=${status}`),
  });
}

export function useDecideApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DecisionInput }) =>
      apiFetch<{ application: ApplicationDTO }>(`/api/admin/applications/${id}/decision`, { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'applications'] });
      qc.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useDisburse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ loan: LoanDTO; installments: InstallmentDTO[] }>(`/api/admin/applications/${id}/disburse`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'applications'] });
      qc.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}
