/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import Fastify, { type FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler } from './lib/errors.js';
import { authRoutes } from './routes/auth.js';
import { applicationRoutes } from './routes/applications.js';
import { adminRoutes } from './routes/admin.js';
import { loanRoutes } from './routes/loans.js';
import { migrateDb } from './db/migrate.js';
import { getDb } from './db/client.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' } });
  app.setErrorHandler(errorHandler);

  // Initialize DB (in-memory for tests if DATABASE_URL unset)
  getDb();
  migrateDb();

  await app.register(fastifyCookie);
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    cookie: { cookieName: 'lms_session', signed: false },
  });

  app.get('/api/health', async () => ({ ok: true }));
  await authRoutes(app);
  await applicationRoutes(app);
  await adminRoutes(app);
  await loanRoutes(app);

  if (process.env.NODE_ENV === 'production') {
    const webDist = path.resolve(fileURLToPath(import.meta.url), '../../web/dist');
    await app.register(fastifyStatic, {
      root: webDist,
      prefix: '/',
      wildcard: false,
    });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) {
        reply.code(404).send({ error: 'NotFound' });
        return;
      }
      reply.sendFile('index.html');
    });
  }

  return app;
}

