'use client';

import { FilterBar } from '@/components/admin/FilterBar';
import { SubmissionsTable } from '@/components/admin/SubmissionsTable';

export default function SubmissionsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">All service intake requests</p>
      </div>

      <FilterBar />
      <SubmissionsTable />
    </div>
  );
}
