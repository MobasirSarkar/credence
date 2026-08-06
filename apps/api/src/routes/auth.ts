/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { FastifyInstance, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { LoginInput, SignupInput, type UserDTO } from '@lms/shared';
import { ConflictError, UnauthorizedError } from '../lib/errors.js';
import { getDb, resetDb } from '../db/client.js';
import { users } from '../db/schema.js';
import {
  hashPassword, verifyPassword,
  setAccessCookie, setRefreshCookie, clearAuthCookies,
  requireAuth, requireRefresh, toUserDTO, type SessionUser,
} from '../lib/auth.js';

async function issueSession(reply: FastifyReply, payload: SessionUser) {
  const access = await reply.jwtSign(payload, { expiresIn: '1h' });
  const refresh = await reply.jwtSign(payload, { expiresIn: '30d' });
  setAccessCookie(reply, access);
  setRefreshCookie(reply, refresh);
}

export async function authRoutes(app: FastifyInstance) {
  const db = getDb();

  app.post('/api/auth/signup', async (req, reply) => {
    const input = SignupInput.parse(req.body);
    const existing = db.select().from(users).where(eq(users.email, input.email)).all();
    if (existing.length > 0) throw new ConflictError('EmailAlreadyUsed');
    const id = nanoid(21);
    const passwordHash = await hashPassword(input.password);
    db.insert(users).values({
      id,
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      role: 'applicant',
      monthlyIncome: input.monthlyIncome,
      createdAt: new Date().toISOString(),
    }).run();
    await issueSession(reply, { id, role: 'applicant' });
    const user: UserDTO = { id, email: input.email, fullName: input.fullName, role: 'applicant', monthlyIncome: input.monthlyIncome };
    return reply.code(201).send({ user });
  });

  app.post('/api/auth/login', async (req, reply) => {
    const input = LoginInput.parse(req.body);
    const rows = db.select().from(users).where(eq(users.email, input.email)).all();
    const user = rows[0];
    if (!user) throw new UnauthorizedError('Invalid credentials');
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid credentials');
    await issueSession(reply, { id: user.id, role: user.role });
    return reply.send({ user: toUserDTO(user) });
  });

  app.post('/api/auth/logout', async (_req, reply) => {
    clearAuthCookies(reply);
    return reply.code(204).send();
  });

  app.post('/api/auth/refresh', async (req, reply) => {
    const session = await requireRefresh(req);
    const rows = db.select().from(users).where(eq(users.id, session.id)).all();
    const user = rows[0];
    if (!user) throw new UnauthorizedError('User missing');
    await issueSession(reply, { id: user.id, role: user.role });
    return reply.send({ user: toUserDTO(user) });
  });

  app.get('/api/auth/me', async (req, reply) => {
    const session = await requireAuth(req);
    const rows = db.select().from(users).where(eq(users.id, session.id)).all();
    const user = rows[0];
    if (!user) throw new UnauthorizedError('User missing');
    return reply.send({ user: toUserDTO(user) });
  });
}

// Helper for tests to start clean
export function _resetDb() { resetDb(); }