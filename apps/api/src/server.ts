/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import 'dotenv/config';
import { buildApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
const app = await buildApp();
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
