'use client';

import { useState } from 'react';
import { useLeadsStore, type Lead } from '@/store/leadsStore';
import { cn } from '@/lib/cn';
import { ChevronDown, StickyNote, Send } from 'lucide-react';

const LEAD_STATUSES = ['new', 'attempting', 'contacted', 'qualified', 'disqualified', 'closed'] as const;

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500',
  attempting: 'bg-amber-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-emerald-500',
  disqualified: 'bg-red-400',
  closed: 'bg-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  attempting: 'Attempting',
  contacted: 'Contacted',
  qualified: 'Qualified',
  disqualified: 'Disqualified',
  closed: 'Closed',
};

const PAGE_SIZE = 10;

export function LeadsTable() {
  const leads = useLeadsStore((s) => s.leads);
  const loading = useLeadsStore((s) => s.loading);
  const updateLeadStatus = useLeadsStore((s) => s.updateLeadStatus);
  const updateLeadNotes = useLeadsStore((s) => s.updateLeadNotes);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({});

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

  function toggleExpand(lead: Lead) {
    if (expandedId === lead.id) {
      setExpandedId(null);
    } else {
      setExpandedId(lead.id);
      // Initialize draft with existing notes
      if (notesDraft[lead.id] === undefined) {
        setNotesDraft((prev) => ({ ...prev, [lead.id]: lead.notes || '' }));
      }
    }
  }

  async function saveNotes(leadId: string) {
    const content = notesDraft[leadId] ?? '';
    setSavingNotes((prev) => ({ ...prev, [leadId]: true }));
    try {
      await updateLeadNotes(leadId, content);
    } finally {
      setSavingNotes((prev) => ({ ...prev, [leadId]: false }));
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Reference</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Entity</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">UAE Reg</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="w-10 py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((lead: Lead) => (
              <>
                <tr
                  key={lead.id}
                  onClick={() => toggleExpand(lead)}
                  className={cn(
                    'border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer',
                    expandedId === lead.id && 'bg-gray-50/50'
                  )}
                >
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{lead.referenceNumber}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{lead.contactName}</td>
                  <td className="py-3 px-4 text-gray-600">{lead.entityName || <span className="text-gray-300">—</span>}</td>
                  <td className="py-3 px-4 text-gray-600">{lead.businessEmail}</td>
                  <td className="py-3 px-4 text-gray-600">{lead.phone}</td>
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
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full shrink-0', STATUS_COLORS[lead.status] || 'bg-gray-300')} />
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="text-xs text-gray-600 bg-transparent border-none outline-none cursor-pointer hover:text-gray-900 transition-colors appearance-none pr-4 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0_center]"
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1">
                      {lead.notes && (
                        <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <ChevronDown className={cn(
                        'w-4 h-4 text-gray-300 transition-transform',
                        expandedId === lead.id && 'rotate-180'
                      )} />
                    </div>
                  </td>
                </tr>
                {/* Expanded notes row */}
                {expandedId === lead.id && (
                  <tr key={`${lead.id}-notes`} className="border-b border-gray-100 bg-gray-50/30">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <StickyNote className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</span>
                        </div>
                        <textarea
                          value={notesDraft[lead.id] ?? lead.notes ?? ''}
                          onChange={(e) => setNotesDraft((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                          placeholder="Add notes about this lead..."
                          rows={3}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] text-gray-300">
                            {(notesDraft[lead.id] ?? lead.notes ?? '').length} / 2000
                          </span>
                          <button
                            onClick={() => saveNotes(lead.id)}
                            disabled={savingNotes[lead.id] || (notesDraft[lead.id] ?? lead.notes ?? '') === (lead.notes ?? '')}
                            className={cn(
                              'flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-[11px] font-semibold transition-all',
                              (notesDraft[lead.id] ?? lead.notes ?? '') !== (lead.notes ?? '') && !savingNotes[lead.id]
                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            )}
                          >
                            <Send className="w-3 h-3" />
                            {savingNotes[lead.id] ? 'Saving...' : 'Save Notes'}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
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
