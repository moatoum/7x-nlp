'use client';

import { use } from 'react';
import { SubmissionDetail } from '@/components/admin/SubmissionDetail';

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">
      <SubmissionDetail id={id} />
    </div>
  );
}
