/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { z } from 'zod';

export const LoanStatus = z.enum(['pending', 'approved', 'rejected', 'disbursed']);
export const LoanLifecycle = z.enum(['active', 'closed']);
export const Employment = z.enum(['salaried', 'self_employed']);
export const Role = z.enum(['applicant', 'admin']);

export const SignupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  fullName: z.string().min(1).max(200),
  monthlyIncome: z.number().int().min(0).max(100_000_000_00), // up to ₹10 crore
});
export type SignupInput = z.infer<typeof SignupInput>;

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginInput>;

export const ApplicationInput = z.object({
  amount: z.number().int().min(1_000_00).max(10_00_000_00),     // ₹1,000..₹10,00,000
  termMonths: z.union([z.literal(6), z.literal(12), z.literal(24), z.literal(36)]),
  annualRateBps: z.union([
    z.literal(1000), z.literal(1200), z.literal(1500),
    z.literal(1800), z.literal(2000), z.literal(2400),
  ]),
  purpose: z.string().min(1).max(200),
  employment: Employment,
});
export type ApplicationInput = z.infer<typeof ApplicationInput>;

export const DecisionInput = z.object({
  decision: z.union([z.literal('approve'), z.literal('reject')]),
  reason: z.string().min(1).max(500).optional(),
});
export type DecisionInput = z.infer<typeof DecisionInput>;

export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  role: 'applicant' | 'admin';
  monthlyIncome: number;
}

export interface ApplicationDTO {
  id: string;
  userId: string;
  amount: number;
  termMonths: 6 | 12 | 24 | 36;
  annualRateBps: number;
  purpose: string;
  employment: 'salaried' | 'self_employed';
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  decisionReason: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  disbursedAt: string | null;
  createdAt: string;
  recommendation?: { rule: 'approve' | 'reject'; reason?: string };
}

export interface LoanDTO {
  id: string;
  applicationId: string;
  userId: string;
  principal: number;
  annualRateBps: number;
  termMonths: 6 | 12 | 24 | 36;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed';
  outstanding: number;
}

export interface InstallmentDTO {
  id: string;
  loanId: string;
  sequence: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  paidAmount: number;
  paidAt: string | null;
}