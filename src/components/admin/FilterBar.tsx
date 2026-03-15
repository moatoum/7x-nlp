'use client';

import { Search, X } from 'lucide-react';
import { useAdminUiStore } from '@/store/adminUiStore';
import { CATEGORY_LABELS } from '@/engine/catalog';


const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

const selectClasses =
  'h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-colors appearance-none cursor-pointer';

export function FilterBar() {
  const searchQuery = useAdminUiStore((s) => s.searchQuery);
  const categoryFilter = useAdminUiStore((s) => s.categoryFilter);
  const statusFilter = useAdminUiStore((s) => s.statusFilter);
  const dateRange = useAdminUiStore((s) => s.dateRange);
  const setSearchQuery = useAdminUiStore((s) => s.setSearchQuery);
  const setCategoryFilter = useAdminUiStore((s) => s.setCategoryFilter);
  const setStatusFilter = useAdminUiStore((s) => s.setStatusFilter);
  const setDateRange = useAdminUiStore((s) => s.setDateRange);
  const resetFilters = useAdminUiStore((s) => s.resetFilters);

  const hasActiveFilters =
    searchQuery || categoryFilter || statusFilter || dateRange !== '30d';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/40 transition-colors"
        />
      </div>

      {/* Category filter */}
      <select
        value={categoryFilter || ''}
        onChange={(e) => setCategoryFilter(e.target.value || null)}
        className={selectClasses}
      >
        <option value="">All Categories</option>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={statusFilter || ''}
        onChange={(e) => setStatusFilter(e.target.value || null)}
        className={selectClasses}
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Date range */}
      <select
        value={dateRange}
        onChange={(e) =>
          setDateRange(e.target.value as 'all' | '7d' | '30d' | '90d')
        }
        className={selectClasses}
      >
        {DATE_RANGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Reset
        </button>
      )}
    </div>
  );
}
