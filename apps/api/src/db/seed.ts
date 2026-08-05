/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import 'dotenv/config';
import { addMonths, format, subMonths } from 'date-fns';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { pathToFileURL } from 'node:url';
import { migrateDb } from './migrate.js';
import { getDb, getSqlite } from './client.js';
import { users, loanApplications, loans, installments } from './schema.js';
import { hashPassword } from '../lib/auth.js';
import { generateSchedule } from '../domain/amortization.js';

function upsertUser(email: string, fullName: string, role: 'applicant' | 'admin', monthlyIncome: number, password: string) {
  const db = getDb();
  const existing = db.select().from(users).where(eq(users.email, email)).get();
  if (existing) return existing.id;
  const id = nanoid(21);
  db.insert(users).values({
    id, email, passwordHash: 'pending', fullName, role, monthlyIncome,
    createdAt: new Date().toISOString(),
  }).run();
  return id;
}

export async function seed() {
  migrateDb();
  const db = getDb();
  const sqlite = getSqlite();

  // Hash passwords
  const adminHash = await hashPassword('admin123');
  const aliceHash = await hashPassword('alice123');
  const bobHash = await hashPassword('bob123');

  const adminId = upsertUser('admin@lms.dev', 'Admin', 'admin', 0, 'admin123');
  const aliceId = upsertUser('alice@lms.dev', 'Alice Applicant', 'applicant', 5_000_000, 'alice123');
  const bobId = upsertUser('bob@lms.dev', 'Bob Borrower', 'applicant', 10_000_000, 'bob123');

  sqlite.prepare('UPDATE users SET password_hash=? WHERE id=?').run(adminHash, adminId);
  sqlite.prepare('UPDATE users SET password_hash=? WHERE id=?').run(aliceHash, aliceId);
  sqlite.prepare('UPDATE users SET password_hash=? WHERE id=?').run(bobHash, bobId);

  // Bob's mid-flight loan: 5,000,000 cents, 12 mo, 15% APR, started 3 months ago, 3 paid
  const existingBobLoan = db.select().from(loans).where(eq(loans.userId, bobId)).get();
  if (!existingBobLoan) {
    const appId = nanoid(21);
    const loanId = appId;
    const start = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
    const end = format(addMonths(subMonths(new Date(), 3), 12), 'yyyy-MM-dd');
    const now = new Date().toISOString();
    db.insert(loanApplications).values({
      id: appId, userId: bobId, amountCents: 5_000_000, termMonths: 12, annualRateBps: 1500,
      purpose: 'home renovation', employment: 'salaried',
      status: 'disbursed', decisionReason: 'Approved', decidedBy: adminId, decidedAt: now,
      disbursedAt: now, createdAt: now,
    }).run();
    db.insert(loans).values({
      id: loanId, applicationId: appId, userId: bobId,
      principalCents: 5_000_000, annualRateBps: 1500, termMonths: 12,
      startDate: start, endDate: end, status: 'active', outstandingCents: 5_000_000,
    }).run();
    const schedule = generateSchedule(5_000_000, 1500, 12, start);
    // Mark first 3 as paid, recompute outstanding
    let outstanding = 5_000_000;
    for (let i = 0; i < schedule.length; i++) {
      const row = schedule[i]!;
      const isPaid = i < 3;
      const paidAmount = isPaid ? row.principalDue + row.interestDue : 0;
      const paidAt = isPaid ? new Date(subMonths(new Date(), 3 - i)).toISOString() : null;
      if (isPaid) outstanding -= row.principalDue;
      db.insert(installments).values({
        id: nanoid(21), loanId, sequence: row.sequence, dueDate: row.dueDate,
        principalDue: row.principalDue, interestDue: row.interestDue,
        paidAmount, paidAt,
      }).run();
    }
    sqlite.prepare('UPDATE loans SET outstanding_cents=? WHERE id=?').run(outstanding, loanId);
  }

  console.log('seed: complete');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch((e) => { console.error(e); process.exit(1); });
}