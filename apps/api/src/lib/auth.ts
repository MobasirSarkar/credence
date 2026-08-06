/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import bcrypt from 'bcrypt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError, ForbiddenError } from './errors.js';
import type { UserDTO } from '@lms/shared';

export const ACCESS_COOKIE = 'lms_session';
export const REFRESH_COOKIE = 'lms_refresh';
const ACCESS_MAX_AGE = 60 * 60;             // 1 hour
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;  // 30 days

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export function setAccessCookie(reply: FastifyReply, token: string) {
  reply.setCookie(ACCESS_COOKIE, token, cookieOpts(ACCESS_MAX_AGE));
}
export function setRefreshCookie(reply: FastifyReply, token: string) {
  reply.setCookie(REFRESH_COOKIE, token, cookieOpts(REFRESH_MAX_AGE));
}
export function clearAuthCookies(reply: FastifyReply) {
  reply.clearCookie(ACCESS_COOKIE, { path: '/' });
  reply.clearCookie(REFRESH_COOKIE, { path: '/' });
}

function readCookie(req: FastifyRequest, name: string): string | null {
  const c = req.cookies[name];
  return typeof c === 'string' ? c : null;
}

export interface SessionUser { id: string; role: 'applicant' | 'admin' }

export async function requireAuth(req: FastifyRequest): Promise<SessionUser> {
  const token = readCookie(req, ACCESS_COOKIE);
  if (!token) throw new UnauthorizedError('Not signed in');
  try {
    return await req.server.jwt.verify<SessionUser>(token);
  } catch {
    throw new UnauthorizedError('Invalid session');
  }
}

export async function requireRefresh(req: FastifyRequest): Promise<SessionUser> {
  const token = readCookie(req, REFRESH_COOKIE);
  if (!token) throw new UnauthorizedError('No refresh token');
  try {
    return await req.server.jwt.verify<SessionUser>(token);
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }
}

export async function requireAdmin(req: FastifyRequest): Promise<SessionUser> {
  const user = await requireAuth(req);
  if (user.role !== 'admin') throw new ForbiddenError('Admin only');
  return user;
}

export function toUserDTO(u: {
  id: string; email: string; fullName: string; role: 'applicant' | 'admin'; monthlyIncome: number;
}): UserDTO {
  return { id: u.id, email: u.email, fullName: u.fullName, role: u.role, monthlyIncome: u.monthlyIncome };
}