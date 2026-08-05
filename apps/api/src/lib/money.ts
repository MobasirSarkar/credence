/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

export function roundCents(n: number): number {
  return Math.round(n);
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
export function formatINR(cents: number): string {
  return inr.format(cents / 100);
}
