'use client';

import { create } from 'zustand';
import type { VesselInfo, FlightInfo, PulseNewsItem, PulseSectionState, PulseFilter } from '@/lib/pulse-types';

interface PulseState {
  maritime: PulseSectionState<VesselInfo[]>;
  aviation: PulseSectionState<FlightInfo[]>;
  news: PulseSectionState<PulseNewsItem[]>;
  lastRefreshed: number | null;
  activeFilter: PulseFilter;

  setMaritime: (update: Partial<PulseSectionState<VesselInfo[]>>) => void;
  setAviation: (update: Partial<PulseSectionState<FlightInfo[]>>) => void;
  setNews: (update: Partial<PulseSectionState<PulseNewsItem[]>>) => void;
  setLastRefreshed: (ts: number) => void;
  setActiveFilter: (filter: PulseFilter) => void;
}

export const usePulseStore = create<PulseState>((set) => ({
  maritime: { data: [], loading: true, error: null },
  aviation: { data: [], loading: true, error: null },
  news: { data: [], loading: true, error: null },
  lastRefreshed: null,
  activeFilter: 'all',

  setMaritime: (update) =>
    set((state) => ({ maritime: { ...state.maritime, ...update } })),
  setAviation: (update) =>
    set((state) => ({ aviation: { ...state.aviation, ...update } })),
  setNews: (update) =>
    set((state) => ({ news: { ...state.news, ...update } })),
  setLastRefreshed: (ts) => set({ lastRefreshed: ts }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
