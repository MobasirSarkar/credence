/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useDecideApplication, useDisburse } from '@/hooks/useAdmin';
import type { ApplicationDTO } from '@lms/shared';

export interface ApplicationReviewState {
  application: ApplicationDTO | null;
  isLoading: boolean;
  isError: boolean;
  isDeciding: boolean;
  isDisbursing: boolean;
  reason: string;
  setReason: (s: string) => void;
  approve: () => void;
  reject: () => void;
  disburse: () => void;
  refetch: () => void;
}

/**
 * Single source of truth for the Application Review page.
 * Owns the local reason input + the approve / reject / disburse
 * transitions for a single application.
 */
export function useApplicationReview(id: string | undefined): ApplicationReviewState {
  const q = useQuery({
    queryKey: ['admin', 'application', id],
    queryFn: () => apiFetch<{ application: ApplicationDTO }>(`/api/applications/${id}`),
    enabled: !!id,
  });
  const decide = useDecideApplication();
  const disburse = useDisburse();
  const nav = useNavigate();
  const [reason, setReason] = useState('');

  const application = q.data?.application ?? null;

  const approve = () => {
    if (!application) return;
    decide.mutate(
      { id: application.id, input: { decision: 'approve', reason: reason || 'Approved by underwriter' } },
      {
        onSuccess: () => {
          q.refetch();
          toast.success('Application Approved');
        },
        onError: (e) => toast.error((e as Error).message),
      },
    );
  };

  const reject = () => {
    if (!application || !reason.trim()) return;
    decide.mutate(
      { id: application.id, input: { decision: 'reject', reason } },
      {
        onSuccess: () => {
          q.refetch();
          toast.success('Application Rejected');
        },
        onError: (e) => toast.error((e as Error).message),
      },
    );
  };

  const triggerDisburse = () => {
    if (!application) return;
    disburse.mutate(application.id, {
      onSuccess: (data) => {
        toast.success('Loan Disbursed Successfully!');
        nav(`/loans/${data.loan.id}`);
      },
      onError: (e) => toast.error((e as Error).message),
    });
  };

  return {
    application,
    isLoading: q.isLoading,
    isError: !!q.error || !q.data,
    isDeciding: decide.isPending,
    isDisbursing: disburse.isPending,
    reason,
    setReason,
    approve,
    reject,
    disburse: triggerDisburse,
    refetch: () => q.refetch(),
  };
}
