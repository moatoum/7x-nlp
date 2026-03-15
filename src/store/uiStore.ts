'use client';

import { create } from 'zustand';

interface UIState {
  mobileDrawerOpen: boolean;
  showWelcome: boolean;

  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  dismissWelcome: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileDrawerOpen: false,
  showWelcome: true,

  toggleDrawer: () => set((s) => ({ mobileDrawerOpen: !s.mobileDrawerOpen })),
  setDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
  dismissWelcome: () => set({ showWelcome: false }),
}));
