/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;

before(async () => { app = await buildApp(); });

test('signup creates user and sets cookie', async () => {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: { email: 'a@test.dev', password: 'password1', fullName: 'A', monthlyIncome: 5_000_000 },
  });
  assert.equal(res.statusCode, 201);
  const body = res.json() as { user: { email: string; role: string } };
  assert.equal(body.user.email, 'a@test.dev');
  assert.equal(body.user.role, 'applicant');
  const setCookie = res.headers['set-cookie'];
  assert.ok(String(setCookie).includes('lms_session='));
});

test('signup rejects duplicate email with 409', async () => {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: { email: 'a@test.dev', password: 'password1', fullName: 'A', monthlyIncome: 5_000_000 },
  });
  assert.equal(res.statusCode, 409);
});

test('login + me round-trip', async () => {
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: 'a@test.dev', password: 'password1' },
  });
  assert.equal(login.statusCode, 200);
  const cookie = String(login.headers['set-cookie']).split(';')[0]!;
  const me = await app.inject({
    method: 'GET',
    url: '/api/auth/me',
    headers: { cookie },
  });
  assert.equal(me.statusCode, 200);
  const body = me.json() as { user: { email: string } };
  assert.equal(body.user.email, 'a@test.dev');
});

test('me without cookie is 401', async () => {
  const res = await app.inject({ method: 'GET', url: '/api/auth/me' });
  assert.equal(res.statusCode, 401);
});
