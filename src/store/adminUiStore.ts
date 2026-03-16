'use client';

import { create } from 'zustand';

type UserRole = 'admin' | 'viewer' | null;

interface AdminUIState {
  // Auth
  isAuthenticated: boolean;
  username: string | null;
  userRole: UserRole;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Filters
  searchQuery: string;
  categoryFilter: string | null;
  statusFilter: string | null;
  dateRange: 'all' | '7d' | '30d' | '90d';
  entityFilter: string | null;
  tagFilter: string | null;

  // Auth actions
  login: (username: string, role: string) => void;
  logout: () => void;

  // Permission helpers
  canEditStatus: () => boolean;
  canAddNotes: () => boolean;
  canSetTag: () => boolean;

  // Sidebar actions
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (cat: string | null) => void;
  setStatusFilter: (status: string | null) => void;
  setDateRange: (range: AdminUIState['dateRange']) => void;
  setEntityFilter: (entity: string | null) => void;
  setTagFilter: (tag: string | null) => void;
  resetFilters: () => void;
}

export const useAdminUiStore = create<AdminUIState>((set, get) => ({
  isAuthenticated:
    typeof window !== 'undefined'
      ? sessionStorage.getItem('7x-admin-auth') === 'true'
      : false,
  username:
    typeof window !== 'undefined'
      ? sessionStorage.getItem('7x-admin-user')
      : null,
  userRole:
    typeof window !== 'undefined'
      ? (sessionStorage.getItem('7x-admin-role') as UserRole)
      : null,

  sidebarOpen: false,
  sidebarCollapsed:
    typeof window !== 'undefined'
      ? localStorage.getItem('7x-sidebar-collapsed') === 'true'
      : false,

  searchQuery: '',
  categoryFilter: null,
  statusFilter: null,
  dateRange: '30d',
  entityFilter: null,
  tagFilter: null,

  login: (username, role) => {
    sessionStorage.setItem('7x-admin-auth', 'true');
    sessionStorage.setItem('7x-admin-user', username);
    sessionStorage.setItem('7x-admin-role', role);
    set({ isAuthenticated: true, username, userRole: role as UserRole });
  },
  logout: () => {
    sessionStorage.removeItem('7x-admin-auth');
    sessionStorage.removeItem('7x-admin-user');
    sessionStorage.removeItem('7x-admin-role');
    set({ isAuthenticated: false, username: null, userRole: null });
  },

  canEditStatus: () => get().userRole === 'admin',
  canAddNotes: () => get().userRole === 'admin',
  canSetTag: () => get().userRole === 'admin',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => {
    localStorage.setItem('7x-sidebar-collapsed', String(collapsed));
    set({ sidebarCollapsed: collapsed });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateRange: (range) => set({ dateRange: range }),
  setEntityFilter: (entity) => set({ entityFilter: entity }),
  setTagFilter: (tag) => set({ tagFilter: tag }),
  resetFilters: () =>
    set({ searchQuery: '', categoryFilter: null, statusFilter: null, dateRange: '30d', entityFilter: null, tagFilter: null }),
}));
