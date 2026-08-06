/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { getSqlite } from '../src/db/client.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let adminCookie = '';
let applicantCookie = '';
let loanId = '';

before(async () => {
  app = await buildApp();

  // Signup an applicant
  await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: {
      email: 'loans-other@test.dev',
      password: 'password1',
      fullName: 'Other Applicant',
      monthlyIncome: 1_000_000,
    },
  });

  // Signup admin, promote via SQL, login
  await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: {
      email: 'loans-admin@test.dev',
      password: 'admin1234',
      fullName: 'Loans Admin',
      monthlyIncome: 0,
    },
  });
  getSqlite().prepare("UPDATE users SET role='admin' WHERE email='loans-admin@test.dev'").run();
  const adminLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: 'loans-admin@test.dev', password: 'admin1234' },
  });
  adminCookie = String(adminLogin.headers['set-cookie']).split(';')[0]!;

  // Signup applicant who will own the loan
  const ownerSignup = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: {
      email: 'loans-owner@test.dev',
      password: 'password1',
      fullName: 'Loan Owner',
      monthlyIncome: 5_000_000,
    },
  });
  applicantCookie = String(ownerSignup.headers['set-cookie']).split(';')[0]!;

  // Create application
  const create = await app.inject({
    method: 'POST',
    url: '/api/applications',
    headers: { cookie: applicantCookie },
    payload: {
      amount: 5_000_000,
      termMonths: 12,
      annualRateBps: 1500,
      purpose: 'home',
      employment: 'salaried',
    },
  });
  const appId = (create.json() as { application: { id: string } }).application.id;

  // Approve
  await app.inject({
    method: 'POST',
    url: `/api/admin/applications/${appId}/decision`,
    headers: { cookie: adminCookie },
    payload: { decision: 'approve' },
  });

  // Disburse
  await app.inject({
    method: 'POST',
    url: `/api/admin/applications/${appId}/disburse`,
    headers: { cookie: adminCookie },
  });

  loanId = appId;
});

test('loan is visible to owner with full schedule', async () => {
  const res = await app.inject({
    method: 'GET',
    url: `/api/loans/${loanId}`,
    headers: { cookie: applicantCookie },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json() as {
    loan: { id: string; status: string; outstanding: number; termMonths: number };
    installments: Array<{ sequence: number; paidAmount: number }>;
  };
  assert.equal(body.loan.id, loanId);
  assert.equal(body.loan.status, 'active');
  assert.equal(body.loan.termMonths, 12);
  assert.equal(body.loan.outstanding, 5_000_000);
  assert.equal(body.installments.length, 12);
  assert.ok(body.installments.every((i) => i.paidAmount === 0));
  assert.deepEqual(
    body.installments.map((i) => i.sequence).sort((a, b) => a - b),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  );
});

test('paying first installment decrements outstanding by principal', async () => {
  const res = await app.inject({
    method: 'POST',
    url: `/api/loans/${loanId}/installments/1/pay`,
    headers: { cookie: applicantCookie },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json() as {
    loan: { status: string; outstanding: number };
    installment: {
      sequence: number;
      principalDue: number;
      interestDue: number;
      paidAmount: number;
      paidAt: string | null;
    };
  };
  assert.equal(body.installment.sequence, 1);
  assert.equal(body.installment.paidAmount, body.installment.principalDue + body.installment.interestDue);
  assert.ok(body.installment.paidAt);
  assert.equal(body.loan.outstanding, 5_000_000 - body.installment.principalDue);
  assert.equal(body.loan.status, 'active');
});

test('paying the same installment again is 409', async () => {
  const res = await app.inject({
    method: 'POST',
    url: `/api/loans/${loanId}/installments/1/pay`,
    headers: { cookie: applicantCookie },
  });
  assert.equal(res.statusCode, 409);
});

test('paying the last installment closes the loan', async () => {
  const res = await app.inject({
    method: 'POST',
    url: `/api/loans/${loanId}/installments/12/pay`,
    headers: { cookie: applicantCookie },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json() as {
    loan: { status: string; outstanding: number };
    installment: { sequence: number; paidAmount: number; paidAt: string | null };
  };
  assert.equal(body.installment.sequence, 12);
  assert.ok(body.installment.paidAt);
  assert.equal(body.loan.status, 'closed');
  assert.ok(body.loan.outstanding >= 0);
});
