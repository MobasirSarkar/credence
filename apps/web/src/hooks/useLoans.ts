/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { LoanDTO, InstallmentDTO } from '@lms/shared';

export function useLoans() {
  const fetchLoans = useCallback(
    () => apiFetch<{ loans: LoanDTO[] }>('/api/loans'),
    []
  );

  return useQuery({
    queryKey: ['loans'],
    queryFn: fetchLoans,
    staleTime: 10_000,
  });
}

export function useLoan(id: string | undefined) {
  const fetchSingleLoan = useCallback(
    () => apiFetch<{ loan: LoanDTO; installments: InstallmentDTO[] }>(`/api/loans/${id}`),
    [id]
  );

  return useQuery({
    enabled: !!id,
    queryKey: ['loans', id],
    queryFn: fetchSingleLoan,
    staleTime: 10_000,
  });
}

export function usePayInstallment(loanId: string) {
  const qc = useQueryClient();

  const payInstallmentMutation = useCallback(
    (n: number) =>
      apiFetch<{ installment: InstallmentDTO; loan: LoanDTO }>(
        `/api/loans/${loanId}/installments/${n}/pay`,
        { method: 'POST' }
      ),
    [loanId]
  );

  const handleSuccess = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['loans'] });
    qc.invalidateQueries({ queryKey: ['loans', loanId] });
  }, [qc, loanId]);

  return useMutation({
    mutationFn: payInstallmentMutation,
    onSuccess: handleSuccess,
  });
}
