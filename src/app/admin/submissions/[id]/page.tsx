'use client';

import { use } from 'react';
import { SubmissionDetail } from '@/components/admin/SubmissionDetail';

export default function SubmissionDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">
      <SubmissionDetail id={resolvedParams.id} />
    </div>
  );
}
