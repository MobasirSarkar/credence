/*
 * Run the API in production mode locally: builds assume done, server runs from
 * apps/api/dist/server.js with NODE_ENV=production so static SPA serving + seed
 * activate. Mirrors what Render runs.
 */

import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const apiDir = resolve('apps/api');
const dbPath = resolve(apiDir, 'data', 'lms.db');

mkdirSync(resolve(apiDir, 'data'), { recursive: true });

const child = spawn(
  process.execPath,
  [resolve(apiDir, 'dist/server.js')],
  {
    stdio: 'inherit',
    cwd: apiDir,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      DATABASE_URL: dbPath,
      JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      PORT: process.env.PORT ?? '3000',
    },
  },
);

const forward = (sig) => () => child.kill(sig);
process.on('SIGINT', forward('SIGINT'));
process.on('SIGTERM', forward('SIGTERM'));
child.on('exit', (code) => process.exit(code ?? 0));