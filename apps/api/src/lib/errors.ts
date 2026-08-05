/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export abstract class AppError extends Error {
  abstract readonly status: number;
  abstract readonly code: string;
}

export class ValidationError extends AppError {
  readonly status = 400;
  readonly code = 'ValidationError';
}
export class UnauthorizedError extends AppError {
  readonly status = 401;
  readonly code = 'Unauthorized';
}
export class ForbiddenError extends AppError {
  readonly status = 403;
  readonly code = 'Forbidden';
}
export class NotFoundError extends AppError {
  readonly status = 404;
  readonly code = 'NotFound';
}
export class ConflictError extends AppError {
  readonly status = 409;
  constructor(public override readonly code: string, message?: string) {
    super(message ?? code);
  }
}

export function errorHandler(
  err: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
): void {
  if (err instanceof ZodError) {
    reply.code(400).send({ error: 'ValidationError', issues: err.issues });
    return;
  }
  if (err instanceof AppError) {
    reply.code(err.status).send({ error: err.code, message: err.message });
    return;
  }
  req.log.error(err);
  reply.code(500).send({ error: 'InternalError' });
}
