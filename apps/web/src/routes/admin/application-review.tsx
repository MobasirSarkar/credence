/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { useParams } from 'react-router-dom';
import { useApplicationReview } from '@/hooks/useApplicationReview';
import { LoadingScreen } from '@/components/loading-screen/LoadingScreen';
import { ApplicationReviewHeader } from '@/components/application-review/ApplicationReviewHeader';
import { ApplicationSummary } from '@/components/application-review/ApplicationSummary';
import { RuleRecommendation } from '@/components/application-review/RuleRecommendation';
import { DecisionActions } from '@/components/application-review/DecisionActions';
import { DisbursementActions } from '@/components/application-review/DisbursementActions';
import { ApplicationReviewError } from '@/components/application-review/ApplicationReviewError';

export function ApplicationReview() {
  const { id } = useParams<{ id: string }>();
  const view = useApplicationReview(id);

  if (view.isLoading) return <LoadingScreen text="Loading Application..." />;
  if (view.isError || !view.application) return <ApplicationReviewError />;

  const { application } = view;
  const recommendation = application.recommendation;

  return (
    <main className="min-h-screen bg-brand-paper text-brand-blue font-sans selection:bg-brand-pink selection:text-primary-foreground pb-20">
      <ApplicationReviewHeader applicationId={application.id} status={application.status} />

      <div className="mx-auto max-w-4xl px-6 pt-8 space-y-6">
        <ApplicationSummary application={application} />

        {application.status === 'pending' && recommendation && (
          <RuleRecommendation recommendation={recommendation} />
        )}

        {application.status === 'pending' && (
          <DecisionActions
            reason={view.reason}
            onReasonChange={view.setReason}
            isSubmitting={view.isDeciding}
            onApprove={view.approve}
            onReject={view.reject}
          />
        )}

        {application.status === 'approved' && (
          <DisbursementActions isSubmitting={view.isDisbursing} onDisburse={view.disburse} />
        )}
      </div>
    </main>
  );
}
