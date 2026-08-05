/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import Fastify, { type FastifyInstance } from 'fastify';
import { errorHandler } from './lib/errors.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' } });
  app.setErrorHandler(errorHandler);

  app.get('/api/health', async () => ({ ok: true }));

  return app;
}
