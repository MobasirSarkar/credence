/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getDb, resetDb } from '../src/db/client.js';
import { migrateDb } from '../src/db/migrate.js';
import { users } from '../src/db/schema.js';

test('migrations create users table', () => {
  resetDb();
  migrateDb();
  const db = getDb(':memory:');
  migrateDb();
  const rows = db.select().from(users).all();
  assert.deepEqual(rows, []);
});
