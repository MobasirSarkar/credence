/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id:             text('id').primaryKey(),
  email:          text('email').notNull().unique(),
  passwordHash:   text('password_hash').notNull(),
  fullName:       text('full_name').notNull(),
  role:           text('role', { enum: ['applicant', 'admin'] }).notNull(),
  monthlyIncome:  integer('monthly_income').notNull(),   // cents
  createdAt:      text('created_at').notNull(),
});

export const loanApplications = sqliteTable('loan_applications', {
  id:              text('id').primaryKey(),
  userId:          text('user_id').notNull().references(() => users.id),
  amountCents:     integer('amount_cents').notNull(),
  termMonths:      integer('term_months').notNull(),
  annualRateBps:   integer('annual_rate_bps').notNull(),
  purpose:         text('purpose').notNull(),
  employment:      text('employment', { enum: ['salaried', 'self_employed'] }).notNull(),
  status:          text('status', { enum: ['pending', 'approved', 'rejected', 'disbursed'] }).notNull(),
  decisionReason:  text('decision_reason'),
  decidedBy:       text('decided_by').references(() => users.id),
  decidedAt:       text('decided_at'),
  disbursedAt:     text('disbursed_at'),
  createdAt:       text('created_at').notNull(),
});

export const loans = sqliteTable('loans', {
  id:                text('id').primaryKey(),                                  // = loanApplications.id
  applicationId:     text('application_id').notNull().unique().references(() => loanApplications.id),
  userId:            text('user_id').notNull().references(() => users.id),
  principalCents:    integer('principal_cents').notNull(),
  annualRateBps:     integer('annual_rate_bps').notNull(),
  termMonths:        integer('term_months').notNull(),
  startDate:         text('start_date').notNull(),
  endDate:           text('end_date').notNull(),
  status:            text('status', { enum: ['active', 'closed'] }).notNull(),
  outstandingCents:  integer('outstanding_cents').notNull(),
});

export const installments = sqliteTable('installments', {
  id:            text('id').primaryKey(),
  loanId:        text('loan_id').notNull().references(() => loans.id),
  sequence:      integer('sequence').notNull(),
  dueDate:       text('due_date').notNull(),
  principalDue:  integer('principal_due').notNull(),
  interestDue:   integer('interest_due').notNull(),
  paidAmount:    integer('paid_amount').notNull().default(0),
  paidAt:        text('paid_at'),
}, (t) => ({
  uniqLoanSeq: uniqueIndex('uniq_loan_seq').on(t.loanId, t.sequence),
}));
