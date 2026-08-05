/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { LoanDTO, InstallmentDTO } from '@lms/shared';

export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: () => apiFetch<{ loans: LoanDTO[] }>('/api/loans'),
  });
}

export function useLoan(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: ['loans', id],
    queryFn: () => apiFetch<{ loan: LoanDTO; installments: InstallmentDTO[] }>(`/api/loans/${id}`),
  });
}

export function usePayInstallment(loanId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (n: number) =>
      apiFetch<{ installment: InstallmentDTO; loan: LoanDTO }>(`/api/loans/${loanId}/installments/${n}/pay`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] });
      qc.invalidateQueries({ queryKey: ['loans', loanId] });
    },
  });
}
