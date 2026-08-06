/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useAdminApplications } from '@/hooks/useAdmin';
import { useLogout } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { ApplicationDTO } from '@lms/shared';

export interface UnderwritingApplication extends ApplicationDTO {
  applicant: {
    id: string;
    email: string;
    fullName: string;
    monthlyIncome?: number;
  };
}

export interface UnderwritingReviewState {
  applications: UnderwritingApplication[];
  isLoading: boolean;
  isError: boolean;
  count: number;
  onReview: (id: string) => void;
  onLogout: () => void;
}

/**
 * Single source of truth for the Underwriting Review queue.
 * Wraps `useAdminApplications('pending')` and exposes only the
 * fields the queue UI needs.
 */
export function useUnderwritingReview(): UnderwritingReviewState {
  const q = useAdminApplications('pending');
  const logout = useLogout();
  const nav = useNavigate();

  return {
    applications: (q.data?.applications ?? []) as UnderwritingApplication[],
    isLoading: q.isLoading,
    isError: !!q.error || !q.data,
    count: q.data?.applications.length ?? 0,
    onReview: (id) => nav(`/admin/review/${id}`),
    onLogout: () => logout.mutate(),
  };
}
