/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

let _db: BetterSQLite3Database<typeof schema> | null = null;
let _sqlite: Database.Database | null = null;

export function getDb(url = process.env.DATABASE_URL ?? ':memory:') {
  if (_db) return _db;
  _sqlite = new Database(url);
  _sqlite.pragma('journal_mode = WAL');
  _sqlite.pragma('foreign_keys = ON');
  _db = drizzle(_sqlite, { schema });
  return _db;
}

export function getSqlite() {
  if (!_sqlite) getDb();
  return _sqlite!;
}

// For tests: reset cached connection so each test gets a fresh in-memory DB.
export function resetDb() {
  if (_sqlite) _sqlite.close();
  _db = null;
  _sqlite = null;
}
