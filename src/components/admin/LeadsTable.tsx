'use client';

import { useState } from 'react';
import { useLeadsStore, type Lead } from '@/store/leadsStore';
import { cn } from '@/lib/cn';

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const;

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-emerald-500',
  closed: 'bg-gray-400',
};

const PAGE_SIZE = 10;

export function LeadsTable() {
  const leads = useLeadsStore((s) => s.leads);
  const loading = useLeadsStore((s) => s.loading);
  const updateLeadStatus = useLeadsStore((s) => s.updateLeadStatus);
  const [page, setPage] = useState(0);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400">
        Loading leads...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400">
        No leads yet
      </div>
    );
  }

  const totalPages = Math.ceil(leads.length / PAGE_SIZE);
  const paged = leads.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Reference</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Website</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">UAE Reg</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((lead: Lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-gray-500">{lead.referenceNumber}</td>
                <td className="py-3 px-4 font-medium text-gray-900">{lead.contactName}</td>
                <td className="py-3 px-4 text-gray-600">{lead.businessEmail}</td>
                <td className="py-3 px-4 text-gray-600">{lead.phone}</td>
                <td className="py-3 px-4 text-gray-600">
                  {lead.businessWebsite ? (
                    <a href={lead.businessWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {lead.businessWebsite.replace(/^https?:\/\//, '').slice(0, 25)}
                    </a>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded',
                    lead.uaeRegistered ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  )}>
                    {lead.uaeRegistered ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">
                  {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full shrink-0', STATUS_COLORS[lead.status] || 'bg-gray-300')} />
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="text-xs capitalize text-gray-600 bg-transparent border-none outline-none cursor-pointer hover:text-gray-900 transition-colors appearance-none pr-4 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0_center]"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {leads.length} total lead{leads.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  'w-7 h-7 rounded-lg text-xs font-medium transition-colors',
                  page === i ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
