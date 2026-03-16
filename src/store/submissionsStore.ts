'use client';

import { create } from 'zustand';
import type { Submission, Note } from '@/engine/types';

interface SubmissionsState {
  submissions: Submission[];
  loading: boolean;
  error: string | null;

  /** Fetch all submissions from DB (admin) */
  fetchSubmissions: () => Promise<void>;

  /** Create a new submission via API (intake flow) */
  createSubmission: (submission: Omit<Submission, 'notes'>) => Promise<Submission>;

  /** Update submission status (admin) — optimistic + API */
  updateStatus: (id: string, status: Submission['status']) => Promise<void>;

  /** Add a note to a submission (admin) */
  addNote: (submissionId: string, note: { content: string; visibility: string; author: string }) => Promise<void>;

  /** Update submission tag (admin) — optimistic + API */
  updateTag: (id: string, tag: string | null) => Promise<void>;

  /** Sync lookup from local cache */
  getByReference: (ref: string) => Submission | undefined;

  /** Fetch a single submission by reference from DB (tracking page) */
  fetchByReference: (ref: string) => Promise<Submission | null>;
}

export const useSubmissionsStore = create<SubmissionsState>()((set, get) => ({
  submissions: [],
  loading: false,
  error: null,

  fetchSubmissions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/submissions');
      if (!res.ok) throw new Error('Failed to fetch submissions');
      const data: Submission[] = await res.json();
      set({ submissions: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createSubmission: async (submission) => {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    if (!res.ok) throw new Error('Failed to create submission');
    const created: Submission = await res.json();
    set((state) => ({ submissions: [created, ...state.submissions] }));
    return created;
  },

  updateStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    }));
    try {
      await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Revert on failure
      get().fetchSubmissions();
    }
  },

  updateTag: async (id, tag) => {
    // Optimistic update
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, tag } : s
      ),
    }));
    try {
      await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      });
    } catch {
      get().fetchSubmissions();
    }
  },

  addNote: async (submissionId, note) => {
    const res = await fetch(`/api/submissions/${submissionId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error('Failed to add note');
    const created: Note = await res.json();
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === submissionId
          ? { ...s, notes: [...(s.notes || []), created] }
          : s
      ),
    }));
  },

  getByReference: (ref) =>
    get().submissions.find(
      (s) => s.referenceNumber.toLowerCase() === ref.toLowerCase()
    ),

  fetchByReference: async (ref) => {
    try {
      const res = await fetch(`/api/submissions/track/${encodeURIComponent(ref)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
}));
