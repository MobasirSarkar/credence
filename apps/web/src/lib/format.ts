/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
export function formatINR(cents: number) { return inr.format(cents / 100); }

const date = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
export function formatDate(iso: string) { return date.format(new Date(iso)); }
