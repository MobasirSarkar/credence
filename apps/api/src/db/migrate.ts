/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import 'dotenv/config';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { getDb, getSqlite } from './client.js';

export function migrateDb() {
  const db = getDb();
  const sqlite = getSqlite();
  sqlite.pragma('foreign_keys = ON');
  migrate(db, { migrationsFolder: './drizzle' });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDb();
  console.log('migrations applied');
}
