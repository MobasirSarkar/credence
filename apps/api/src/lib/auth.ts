/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import bcrypt from 'bcrypt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError, ForbiddenError } from './errors.js';
import type { UserDTO } from '@lms/shared';

const COOKIE = 'lms_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}
export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(COOKIE, { path: '/' });
}
export function readSessionCookie(req: FastifyRequest): string | null {
  const c = req.cookies[COOKIE];
  return typeof c === 'string' ? c : null;
}

export interface SessionUser { id: string; role: 'applicant' | 'admin' }

export async function requireAuth(req: FastifyRequest): Promise<SessionUser> {
  const token = readSessionCookie(req);
  if (!token) throw new UnauthorizedError('Not signed in');
  try {
    const decoded = await req.server.jwt.verify<SessionUser>(token);
    return decoded;
  } catch {
    throw new UnauthorizedError('Invalid session');
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
