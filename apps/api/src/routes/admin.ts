/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { FastifyInstance } from 'fastify';
import { desc, eq } from 'drizzle-orm';
import { addMonths, format } from 'date-fns';
import { nanoid } from 'nanoid';
import { DecisionInput, type ApplicationDTO, type InstallmentDTO, type LoanDTO } from '@lms/shared';
import { z } from 'zod';
import { getDb } from '../db/client.js';
import { users, loanApplications, loans, installments } from '../db/schema.js';
import { requireAdmin } from '../lib/auth.js';
import { ConflictError, NotFoundError } from '../lib/errors.js';
import { generateSchedule } from '../domain/amortization.js';


type LoanApplicationRow = typeof loanApplications.$inferSelect;

function toAppDTO(a: LoanApplicationRow): ApplicationDTO {
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
  };
}

export async function adminRoutes(app: FastifyInstance) {
  const db = getDb();

  app.get<{ Querystring: { status?: string } }>('/api/admin/applications', async (req) => {
    await requireAdmin(req);
    const StatusEnum = z.enum(['pending', 'approved', 'rejected', 'disbursed']);
    const status = StatusEnum.parse(req.query.status ?? 'pending');
    const rows = db
      .select({
        app: loanApplications,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          role: users.role,
          monthlyIncome: users.monthlyIncome,
        },
      })
      .from(loanApplications)
      .innerJoin(users, eq(users.id, loanApplications.userId))
      .where(eq(loanApplications.status, status))
      .orderBy(desc(loanApplications.createdAt))
      .all();
    return {
      applications: rows.map(({ app: a, user: u }) => ({
        ...toAppDTO(a),
        applicant: {
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          role: u.role as 'applicant' | 'admin',
          monthlyIncome: u.monthlyIncome,
        },
      })),
    };
  });

  app.post<{ Params: { id: string } }>('/api/admin/applications/:id/decision', async (req) => {
    const session = await requireAdmin(req);
    const input = DecisionInput.parse(req.body);
    const row = db
      .select()
      .from(loanApplications)
      .where(eq(loanApplications.id, req.params.id))
      .get();
    if (!row) throw new NotFoundError('Application not found');
    if (row.status !== 'pending') {
      throw new ConflictError('InvalidStateTransition', `Cannot decide on ${row.status} application`);
    }
    const now = new Date().toISOString();
    db.update(loanApplications)
      .set({
        status: input.decision === 'approve' ? 'approved' : 'rejected',
        decisionReason:
          input.reason ?? (input.decision === 'approve' ? 'Approved by admin' : 'Rejected by admin'),
        decidedBy: session.id,
        decidedAt: now,
      })
      .where(eq(loanApplications.id, row.id))
      .run();
    const updated = db
      .select()
      .from(loanApplications)
      .where(eq(loanApplications.id, row.id))
      .get()!;
    return { application: toAppDTO(updated) };
  });

  app.post<{ Params: { id: string } }>('/api/admin/applications/:id/disburse', async (req) => {
    await requireAdmin(req);
    const row = db.select().from(loanApplications).where(eq(loanApplications.id, req.params.id)).get();
    if (!row) throw new NotFoundError('Application not found');
    if (row.status !== 'approved') {
      throw new ConflictError('InvalidStateTransition', `Cannot disburse ${row.status} application`);
    }
    const startDate = format(new Date(), 'yyyy-MM-dd');
    const endDate = format(addMonths(new Date(startDate), row.termMonths), 'yyyy-MM-dd');
    const schedule = generateSchedule(row.amountCents, row.annualRateBps, row.termMonths, startDate);
    const newLoanId = row.id;
    const now = new Date().toISOString();

    db.transaction((tx) => {
      tx.insert(loans).values({
        id: newLoanId,
        applicationId: row.id,
        userId: row.userId,
        principalCents: row.amountCents,
        annualRateBps: row.annualRateBps,
        termMonths: row.termMonths,
        startDate,
        endDate,
        status: 'active',
        outstandingCents: row.amountCents,
      }).run();
      tx.insert(installments).values(
        schedule.map((s) => ({
          id: nanoid(21),
          loanId: newLoanId,
          sequence: s.sequence,
          dueDate: s.dueDate,
          principalDue: s.principalDue,
          interestDue: s.interestDue,
        })),
      ).run();
      tx.update(loanApplications)
        .set({ status: 'disbursed', disbursedAt: now })
        .where(eq(loanApplications.id, row.id))
        .run();
    });

    const loanRow = db.select().from(loans).where(eq(loans.id, newLoanId)).get()!;
    const installmentRows = db.select().from(installments).where(eq(installments.loanId, newLoanId)).all();
    return {
      loan: {
        id: loanRow.id,
        applicationId: loanRow.applicationId,
        userId: loanRow.userId,
        principal: loanRow.principalCents,
        annualRateBps: loanRow.annualRateBps,
        termMonths: loanRow.termMonths as 6 | 12 | 24 | 36,
        startDate: loanRow.startDate,
        endDate: loanRow.endDate,
        status: loanRow.status as 'active' | 'closed',
        outstanding: loanRow.outstandingCents,
      } satisfies LoanDTO,
      installments: installmentRows.map((i) => ({
        id: i.id,
        loanId: i.loanId,
        sequence: i.sequence,
        dueDate: i.dueDate,
        principalDue: i.principalDue,
        interestDue: i.interestDue,
        paidAmount: i.paidAmount,
        paidAt: i.paidAt,
      })) satisfies InstallmentDTO[],
    };
  });
}
