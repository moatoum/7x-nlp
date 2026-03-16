'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Submission, Note } from '@/engine/types';

interface SubmissionsState {
  submissions: Submission[];
  initialized: boolean;

  addSubmission: (submission: Submission) => void;
  updateStatus: (id: string, status: Submission['status']) => void;
  addNote: (submissionId: string, note: Note) => void;
  getByReference: (ref: string) => Submission | undefined;
  initialize: (seed: Submission[]) => void;
}

export const useSubmissionsStore = create<SubmissionsState>()(
  persist(
    (set, get) => ({
      submissions: [],
      initialized: false,

      addSubmission: (submission) =>
        set((state) => ({
          submissions: [submission, ...state.submissions],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        })),

      addNote: (submissionId, note) =>
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === submissionId
              ? { ...s, notes: [...(s.notes || []), note] }
              : s
          ),
        })),

      getByReference: (ref) =>
        get().submissions.find(
          (s) => s.referenceNumber.toLowerCase() === ref.toLowerCase()
        ),

      initialize: (seed) => {
        if (!get().initialized) {
          set({ submissions: seed, initialized: true });
        }
      },
    }),
    {
      name: '7x-submissions',
    }
  )
);

// Sync submissions store across browser tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === '7x-submissions' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed?.state?.submissions) {
          useSubmissionsStore.setState({
            submissions: parsed.state.submissions,
            initialized: parsed.state.initialized ?? false,
          });
        }
      } catch {
        // ignore parse errors
      }
    }
  });
}
