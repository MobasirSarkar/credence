/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { ArrowRight, FileText } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { ApplicationCard } from './ApplicationCard';
import type { ApplicationDTO } from '@lms/shared';

interface ApplicationsListProps {
  applications: ApplicationDTO[];
  onApply: () => void;
}

export function ApplicationsList({ applications, onApply }: ApplicationsListProps) {
  return (
    <section aria-label="Loan applications" className="space-y-4">
      <SectionHeader icon={FileText} title="Your Loan Applications" count={applications.length} />

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No loan applications found"
          description="Apply in under 2 minutes with instant FOIR evaluation and zero branch visits."
          action={
            <Button onClick={onApply}>
              Apply for Your First Loan
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
          {applications.map((a) => (
            <li key={a.id}>
              <ApplicationCard application={a} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
