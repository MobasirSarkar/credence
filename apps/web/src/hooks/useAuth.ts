/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiFetch, markSessionAlive } from '@/lib/api';
import type { SignupInput, LoginInput, UserDTO } from '@lms/shared';

const USER_SCOPED_KEYS: readonly string[] = ['loans', 'applications'];

/** Drop any user-scoped queries so the next user doesn't see previous data. */
function clearUserData(qc: QueryClient) {
  for (const key of USER_SCOPED_KEYS) qc.removeQueries({ queryKey: [key] });
}

export function useLogin() {
  const qc = useQueryClient();
  const nav = useNavigate();
  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<{ user: UserDTO }>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: (data) => {
      markSessionAlive();
      qc.setQueryData(['me'], data);
      clearUserData(qc);
      nav(data.user.role === 'admin' ? '/admin/review' : '/dashboard');
    },
  });
}

export function useSignup() {
  const qc = useQueryClient();
  const nav = useNavigate();
  return useMutation({
    mutationFn: (input: SignupInput) =>
      apiFetch<{ user: UserDTO }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: (data) => {
      markSessionAlive();
      qc.setQueryData(['me'], data);
      clearUserData(qc);
      nav('/dashboard');
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const nav = useNavigate();
  return useMutation({
    mutationFn: () => apiFetch<void>('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      qc.setQueryData(['me'], null);
      clearUserData(qc);
      nav('/');
    },
  });
}