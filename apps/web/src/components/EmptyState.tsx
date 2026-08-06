/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <Icon className="mx-auto size-12 text-brand-blue/40 mb-3" />
        <h3 className="text-lg font-bold text-brand-blue">{title}</h3>
        {description && (
          <p className="text-sm text-brand-blue/70 font-medium max-w-sm mx-auto mt-1 mb-5">
            {description}
          </p>
        )}
        {action}
      </CardContent>
    </Card>
  );
}