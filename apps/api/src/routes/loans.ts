/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { FastifyInstance } from 'fastify';
import { and, eq } from 'drizzle-orm';
import type { InstallmentDTO, LoanDTO } from '@lms/shared';
import { getDb } from '../db/client.js';
import { loans, installments } from '../db/schema.js';
import { requireAuth } from '../lib/auth.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../lib/errors.js';

type LoanRow = typeof loans.$inferSelect;
type InstallmentRow = typeof installments.$inferSelect;

function toLoanDTO(l: LoanRow): LoanDTO {
  return {
    id: l.id,
    applicationId: l.applicationId,
    userId: l.userId,
    principal: l.principalCents,
    annualRateBps: l.annualRateBps,
    termMonths: l.termMonths as 6 | 12 | 24 | 36,
    startDate: l.startDate,
    endDate: l.endDate,
    status: l.status as 'active' | 'closed',
    outstanding: l.outstandingCents,
  };
}

function toInstallmentDTO(i: InstallmentRow): InstallmentDTO {
  return {
    id: i.id,
    loanId: i.loanId,
    sequence: i.sequence,
    dueDate: i.dueDate,
    principalDue: i.principalDue,
    interestDue: i.interestDue,
    paidAmount: i.paidAmount,
    paidAt: i.paidAt,
  };
}

export async function loanRoutes(app: FastifyInstance) {
  const db = getDb();

  app.get('/api/loans', async (req) => {
    const session = await requireAuth(req);
    const rows = db
      .select()
      .from(loans)
      .where(eq(loans.userId, session.id))
      .all();
    return { loans: rows.map(toLoanDTO) };
  });

  app.get<{ Params: { id: string } }>('/api/loans/:id', async (req) => {
    const session = await requireAuth(req);
    const row = db.select().from(loans).where(eq(loans.id, req.params.id)).get();
    if (!row) throw new NotFoundError('Loan not found');
    if (row.userId !== session.id) throw new ForbiddenError('Not your loan');
    const installmentRows = db
      .select()
      .from(installments)
      .where(eq(installments.loanId, row.id))
      .all();
    return { loan: toLoanDTO(row), installments: installmentRows.map(toInstallmentDTO) };
  });

  app.post<{ Params: { id: string; n: string } }>(
    '/api/loans/:id/installments/:n/pay',
    async (req) => {
      const session = await requireAuth(req);
      const loan = db.select().from(loans).where(eq(loans.id, req.params.id)).get();
      if (!loan) throw new NotFoundError('Loan not found');
      if (loan.userId !== session.id) throw new ForbiddenError('Not your loan');
      if (loan.status === 'closed') {
        throw new ConflictError('LoanClosed', 'Loan is already closed');
      }
      const seq = Number.parseInt(req.params.n, 10);
      if (!Number.isInteger(seq) || seq < 1 || seq > loan.termMonths) {
        throw new NotFoundError('Installment not found');
      }
      const now = new Date().toISOString();

      const paid = db.transaction((tx) => {
        const inst = tx
          .select()
          .from(installments)
          .where(and(eq(installments.loanId, loan.id), eq(installments.sequence, seq)))
          .get();
        if (!inst) throw new NotFoundError('Installment not found');
        if (inst.paidAmount > 0) {
          throw new ConflictError('InstallmentAlreadyPaid', 'Installment is already paid');
        }
        const paidAmount = inst.principalDue + inst.interestDue;
        tx.update(installments)
          .set({ paidAmount, paidAt: now })
          .where(eq(installments.id, inst.id))
          .run();
        tx.update(loans)
          .set({
            outstandingCents: loan.outstandingCents - inst.principalDue,
            status: seq === loan.termMonths ? 'closed' : 'active',
          })
          .where(eq(loans.id, loan.id))
          .run();
        return inst.id;
      });

      const updatedLoan = db.select().from(loans).where(eq(loans.id, loan.id)).get()!;
      const updatedInst = db
        .select()
        .from(installments)
        .where(eq(installments.id, paid))
        .get()!;
      return { installment: toInstallmentDTO(updatedInst), loan: toLoanDTO(updatedLoan) };
    },
  );
}
