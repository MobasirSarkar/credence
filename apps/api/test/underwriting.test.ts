/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from '../src/domain/underwriting.js';

test('rejects when income is zero', () => {
  const r = evaluate(0, 5_000_000, 1500, 12);
  assert.equal(r.recommendation, 'reject');
  assert.match(r.reason ?? '', /income/i);
});

test('rejects when FOIR exceeds 50%', () => {
  // Income 800,000 cents (₹8,000). EMI for 50,000 over 12mo at 15% ≈ ₹4,508. FOIR ≈ 0.56.
  const r = evaluate(800_000, 5_000_000, 1500, 12);
  assert.equal(r.recommendation, 'reject');
  assert.match(r.reason ?? '', /50%/);
});

test('rejects when income is less than 3x EMI', () => {
  // Income 1,300,000 (₹13,000). 3*EMI ≈ ₹13,525. Just under.
  const r = evaluate(1_300_000, 5_000_000, 1500, 12);
  assert.equal(r.recommendation, 'reject');
  assert.match(r.reason ?? '', /insufficient/i);
});

test('approves a healthy application', () => {
  // Income 5,000,000 (₹50,000). EMI ≈ ₹4,508. FOIR ≈ 0.09. 3x EMI ≈ ₹13,525. Pass.
  const r = evaluate(5_000_000, 5_000_000, 1500, 12);
  assert.equal(r.recommendation, 'approve');
  assert.equal(r.reason, undefined);
});

test('approves at the 3x income boundary', () => {
  // 3x rule is the tightest floor; income = 3 * EMI + 1 passes both rules (FOIR ≈ 0.33).
  const r = evaluate(3 * 451292 + 1, 5_000_000, 1500, 12);
  assert.equal(r.recommendation, 'approve');
});
