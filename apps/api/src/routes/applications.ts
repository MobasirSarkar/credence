/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { FastifyInstance } from 'fastify';
import { desc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { ApplicationInput, type ApplicationDTO } from '@lms/shared';
import { getDb } from '../db/client.js';
import { users, loanApplications } from '../db/schema.js';
import { requireAuth } from '../lib/auth.js';
import { NotFoundError } from '../lib/errors.js';
import { evaluate } from '../domain/underwriting.js';

type LoanApplicationRow = typeof loanApplications.$inferSelect;

function toAppDTO(a: LoanApplicationRow, recommendation?: { rule: 'approve' | 'reject'; reason?: string }): ApplicationDTO {
  return {
    id: a.id,
    userId: a.userId,
    amount: a.amountCents,
    termMonths: a.termMonths as 6 | 12 | 24 | 36,
    annualRateBps: a.annualRateBps,
    purpose: a.purpose,
    employment: a.employment as 'salaried' | 'self_employed',
    status: a.status as ApplicationDTO['status'],
    decisionReason: a.decisionReason,
    decidedBy: a.decidedBy,
    decidedAt: a.decidedAt,
    disbursedAt: a.disbursedAt,
    createdAt: a.createdAt,
    ...(recommendation ? { recommendation } : {}),
  };
}

export async function applicationRoutes(app: FastifyInstance) {
  const db = getDb();

  app.post('/api/applications', async (req, reply) => {
    const session = await requireAuth(req);
    const input = ApplicationInput.parse(req.body);
    const u = db.select().from(users).where(eq(users.id, session.id)).get();
    if (!u) throw new NotFoundError('User missing');

    const rec = evaluate(u.monthlyIncome, input.amount, input.annualRateBps, input.termMonths);
    const id = nanoid(21);
    const now = new Date().toISOString();

    if (rec.recommendation === 'reject') {
      db.insert(loanApplications).values({
        id,
        userId: session.id,
        amountCents: input.amount,
        termMonths: input.termMonths,
        annualRateBps: input.annualRateBps,
        purpose: input.purpose,
        employment: input.employment,
        status: 'rejected',
        decisionReason: rec.reason ?? null,
        decidedBy: null,
        decidedAt: now,
        createdAt: now,
      }).run();
    } else {
      db.insert(loanApplications).values({
        id,
        userId: session.id,
        amountCents: input.amount,
        termMonths: input.termMonths,
        annualRateBps: input.annualRateBps,
        purpose: input.purpose,
        employment: input.employment,
        status: 'pending',
        createdAt: now,
      }).run();
    }
    const row = db.select().from(loanApplications).where(eq(loanApplications.id, id)).get()!;
    return reply.code(201).send({ application: toAppDTO(row, { rule: rec.recommendation, ...(rec.reason ? { reason: rec.reason } : {}) }) });
  });

  app.get('/api/applications', async (req) => {
    const session = await requireAuth(req);
    const rows = db.select().from(loanApplications)
      .where(eq(loanApplications.userId, session.id))
      .orderBy(desc(loanApplications.createdAt))
      .all();
    return { applications: rows.map((r) => toAppDTO(r)) };
  });

  app.get<{ Params: { id: string } }>('/api/applications/:id', async (req) => {
    const session = await requireAuth(req);
    const row = db.select().from(loanApplications).where(eq(loanApplications.id, req.params.id)).get();
    if (!row) throw new NotFoundError('Application not found');
    if (row.userId !== session.id && session.role !== 'admin') throw new NotFoundError('Application not found');
    return { application: toAppDTO(row) };
  });
}
