/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { credentials: 'include', ...init, headers: { 'content-type': 'application/json', ...(init.headers ?? {}) } });
  if (!res.ok) {
    let body: { error?: string; message?: string } = {};
    try { body = await res.json(); } catch { /* ignore */ }
    const err = new Error(body.message ?? body.error ?? `HTTP ${res.status}`);
    (err as Error & { status: number; code?: string }).status = res.status;
    if (body.error !== undefined) {
      (err as Error & { status: number; code: string }).code = body.error;
    }
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
