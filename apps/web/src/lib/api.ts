/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

export const SESSION_EXPIRED_EVENT = 'lms:session-expired';

let sessionDead = false;

export function markSessionAlive() {
  sessionDead = false;
}

export function notifySessionExpired() {
  if (sessionDead) return;
  sessionDead = true;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
  }
}

const NO_REFRESH_PATHS = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/auth/refresh',
];

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then((r) => {
        if (r.ok) sessionDead = false;
        return r.ok;
      })
      .catch(() => false)
      .finally(() => {
        setTimeout(() => {
          refreshInFlight = null;
        }, 0);
      });
  }
  return refreshInFlight;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const doFetch = () => fetch(path, { credentials: 'include', ...init, headers });

  let res = await doFetch();

  if (res.status === 401 && !sessionDead && !NO_REFRESH_PATHS.some((p) => path.startsWith(p))) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      sessionDead = false;
      res = await doFetch();
    } else {
      notifySessionExpired();
    }
  }

  if (res.ok) {
    sessionDead = false;
  }

  if (!res.ok) {
    let body: { error?: string; message?: string } = {};
    try { body = await res.json(); } catch { /* ignore */ }
    const err = new Error(body.message ?? body.error ?? `HTTP ${res.status}`);
    (err as Error & { status?: number; code?: string }).status = res.status;
    if (body.error !== undefined) {
      (err as Error & { status?: number; code?: string }).code = body.error;
    }
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}