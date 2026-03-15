'use client';

import { create } from 'zustand';

interface AdminUIState {
  sidebarOpen: boolean;
  searchQuery: string;
  categoryFilter: string | null;
  statusFilter: string | null;
  dateRange: 'all' | '7d' | '30d' | '90d';

  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (cat: string | null) => void;
  setStatusFilter: (status: string | null) => void;
  setDateRange: (range: AdminUIState['dateRange']) => void;
  resetFilters: () => void;
}

export const useAdminUiStore = create<AdminUIState>((set) => ({
  sidebarOpen: false,
  searchQuery: '',
  categoryFilter: null,
  statusFilter: null,
  dateRange: '30d',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateRange: (range) => set({ dateRange: range }),
  resetFilters: () =>
    set({ searchQuery: '', categoryFilter: null, statusFilter: null, dateRange: '30d' }),
}));
