/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { SignupInput, LoginInput, UserDTO } from '@lms/shared';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const qc = useQueryClient();
  const nav = useNavigate();
  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<{ user: UserDTO }>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: (data) => {
      qc.setQueryData(['me'], data);
      nav(data.user.role === 'admin' ? '/admin' : '/dashboard');
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
      qc.setQueryData(['me'], data);
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
      qc.invalidateQueries();
      nav('/');
    },
  });
}
