'use client';

import { LeadsTable } from '@/components/admin/LeadsTable';

export default function LeadsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Leads</h1>
        <p className="text-sm text-gray-500 mt-1">Expert consultation requests</p>
      </div>

      <LeadsTable />
    </div>
  );
}
