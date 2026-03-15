'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Submission } from '@/engine/types';

interface SubmissionsState {
  submissions: Submission[];
  initialized: boolean;

  addSubmission: (submission: Submission) => void;
  updateStatus: (id: string, status: Submission['status']) => void;
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
