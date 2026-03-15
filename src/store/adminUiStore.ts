'use client';

import { create } from 'zustand';

interface AdminUIState {
  // Auth
  isAuthenticated: boolean;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Filters
  searchQuery: string;
  categoryFilter: string | null;
  statusFilter: string | null;
  dateRange: 'all' | '7d' | '30d' | '90d';

  // Auth actions
  login: () => void;
  logout: () => void;

  // Sidebar actions
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (cat: string | null) => void;
  setStatusFilter: (status: string | null) => void;
  setDateRange: (range: AdminUIState['dateRange']) => void;
  resetFilters: () => void;
}

export const useAdminUiStore = create<AdminUIState>((set) => ({
  isAuthenticated:
    typeof window !== 'undefined'
      ? sessionStorage.getItem('7x-admin-auth') === 'true'
      : false,

  sidebarOpen: false,
  sidebarCollapsed:
    typeof window !== 'undefined'
      ? localStorage.getItem('7x-sidebar-collapsed') === 'true'
      : false,

  searchQuery: '',
  categoryFilter: null,
  statusFilter: null,
  dateRange: '30d',

  login: () => {
    sessionStorage.setItem('7x-admin-auth', 'true');
    set({ isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem('7x-admin-auth');
    set({ isAuthenticated: false });
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => {
    localStorage.setItem('7x-sidebar-collapsed', String(collapsed));
    set({ sidebarCollapsed: collapsed });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateRange: (range) => set({ dateRange: range }),
  resetFilters: () =>
    set({ searchQuery: '', categoryFilter: null, statusFilter: null, dateRange: '30d' }),
}));
