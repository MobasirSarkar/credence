/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateEmi, generateSchedule } from '../src/domain/amortization.js';

test('calculateEmi matches closed-form for standard input', () => {
  // P=5,000,000 cents (₹50,000), 15% APR, 12 months
  const emi = calculateEmi(5_000_000, 1500, 12);
  // closed-form: 50000 * 0.0125 * 1.0125^12 / (1.0125^12 - 1) ≈ 4512.88 (1.0125^12 ≈ 1.16075452)
  assert.ok(Math.abs(emi - 451288) <= 5, `emi was ${emi}`);
});

test('calculateEmi handles zero rate', () => {
  assert.equal(calculateEmi(1_200_000, 0, 12), 100000); // 1,200,000 / 12 = 100,000 cents
});

test('generateSchedule sums to principal', () => {
  const schedule = generateSchedule(5_000_000, 1500, 12, '2026-01-01');
  assert.equal(schedule.length, 12);
  const sumPrincipal = schedule.reduce((a, r) => a + r.principalDue, 0);
  assert.equal(sumPrincipal, 5_000_000);
  // Due dates: monthly on the 1st
  assert.equal(schedule[0]?.dueDate, '2026-02-01');
  assert.equal(schedule[11]?.dueDate, '2027-01-01');
  // Each row has non-negative interest and positive principal
  for (const row of schedule) {
    assert.ok(row.principalDue > 0, `row ${row.sequence} principalDue ${row.principalDue}`);
    assert.ok(row.interestDue >= 0, `row ${row.sequence} interestDue ${row.interestDue}`);
  }
});

test('generateSchedule end-of-month clamp (Jan 31 + 1 month)', () => {
  const schedule = generateSchedule(1_200_000, 0, 3, '2026-01-31');
  assert.equal(schedule[0]?.dueDate, '2026-02-28');
  assert.equal(schedule[1]?.dueDate, '2026-03-31');
  assert.equal(schedule[2]?.dueDate, '2026-04-30');
});
