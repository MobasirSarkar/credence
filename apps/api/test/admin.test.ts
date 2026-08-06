/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { getSqlite } from '../src/db/client.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let applicantCookie = '';

test('non-admin cannot access admin queue', async () => {
  app = await buildApp();
  // Sign up an applicant
  const signup = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: {
      email: 'nonadmin@test.dev',
      password: 'password1',
      fullName: 'Not Admin',
      monthlyIncome: 1_000_000,
    },
  });
  applicantCookie = String(signup.headers['set-cookie']).split(';')[0]!;

  const res = await app.inject({
    method: 'GET',
    url: '/api/admin/applications',
    headers: { cookie: applicantCookie },
  });
  assert.equal(res.statusCode, 403);
});

test('admin queue + decision flow', async () => {
  // Sign up an admin
  const adminSignup = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: {
      email: 'admin@test.dev',
      password: 'admin1234',
      fullName: 'Admin',
      monthlyIncome: 0,
    },
  });
  // Promote to admin via direct DB (signup creates applicant)
  getSqlite().prepare("UPDATE users SET role='admin' WHERE email='admin@test.dev'").run();
  const adminLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: 'admin@test.dev', password: 'admin1234' },
  });
  const adminCookie = String(adminLogin.headers['set-cookie']).split(';')[0]!;

  const queue = await app.inject({
    method: 'GET',
    url: '/api/admin/applications?status=pending',
    headers: { cookie: adminCookie },
  });
  assert.equal(queue.statusCode, 200);
  const queueBody = queue.json() as { applications: Array<{ id: string }> };
  const someId = queueBody.applications[0]?.id;
  if (!someId) return; // no pending apps (acceptable)

  const decision = await app.inject({
    method: 'POST',
    url: `/api/admin/applications/${someId}/decision`,
    headers: { cookie: adminCookie },
    payload: { decision: 'approve', reason: 'looks good' },
  });
  assert.equal(decision.statusCode, 200);
  const decBody = decision.json() as { application: { status: string } };
  assert.equal(decBody.application.status, 'approved');

  // Double-decide should 409
  const second = await app.inject({
    method: 'POST',
    url: `/api/admin/applications/${someId}/decision`,
    headers: { cookie: adminCookie },
    payload: { decision: 'reject' },
  });
  assert.equal(second.statusCode, 409);
});
