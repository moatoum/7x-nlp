'use client';

import { create } from 'zustand';

export interface Lead {
  id: string;
  referenceNumber: string;
  status: string;
  createdAt: number;
  contactName: string;
  businessEmail: string;
  phone: string;
  businessWebsite: string | null;
  uaeRegistered: boolean;
  notes: string | null;
}

interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  updateLeadStatus: (id: string, status: string) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>()((set) => ({
  leads: [],
  loading: false,
  error: null,

  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data: Lead[] = await res.json();
      set({ leads: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  updateLeadStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    }));
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        // Revert on failure — re-fetch to get correct state
        const revertRes = await fetch('/api/leads');
        if (revertRes.ok) {
          const data: Lead[] = await revertRes.json();
          set({ leads: data });
        }
        throw new Error('Failed to update lead status');
      }
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
