/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let cookie = '';

before(async () => {
  app = await buildApp();
  const signup = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: { email: 'applicant@test.dev', password: 'password1', fullName: 'App Test', monthlyIncome: 5_000_000 },
  });
  cookie = String(signup.headers['set-cookie']).split(';')[0]!;
});

test('create application with healthy income is pending', async () => {
  const res = await app.inject({
    method: 'POST',
    url: '/api/applications',
    headers: { cookie },
    payload: { amount: 5_000_000, termMonths: 12, annualRateBps: 1500, purpose: 'home', employment: 'salaried' },
  });
  assert.equal(res.statusCode, 201);
  const body = res.json() as { application: { status: string; recommendation: { rule: string } } };
  assert.equal(body.application.status, 'pending');
  assert.equal(body.application.recommendation.rule, 'approve');
});

test('create application with FOIR>50% is auto-rejected', async () => {
  const lowSignup = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: { email: 'low@test.dev', password: 'password1', fullName: 'Low', monthlyIncome: 500_000 },
  });
  const lowCookie = String(lowSignup.headers['set-cookie']).split(';')[0]!;
  const res = await app.inject({
    method: 'POST',
    url: '/api/applications',
    headers: { cookie: lowCookie },
    payload: { amount: 5_000_000, termMonths: 12, annualRateBps: 1500, purpose: 'home', employment: 'salaried' },
  });
  assert.equal(res.statusCode, 201);
  const body = res.json() as { application: { status: string; decisionReason: string | null } };
  assert.equal(body.application.status, 'rejected');
  assert.ok(body.application.decisionReason);
});
