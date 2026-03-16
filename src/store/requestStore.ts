'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RequestFields, RequestStage, ServiceMatch } from '@/engine/types';

interface RequestState extends RequestFields {
  recommendedServices: ServiceMatch[];
  stage: RequestStage;
  completionPercent: number;
  referenceNumber: string | null;
  // Track recently updated fields for highlight animation
  highlightedFields: Set<string>;

  updateField: (field: keyof RequestFields, value: string | string[] | null) => void;
  setRecommendedServices: (services: ServiceMatch[]) => void;
  setStage: (stage: RequestStage) => void;
  computeCompletion: () => void;
  setReferenceNumber: (ref: string) => void;
  highlightField: (field: string) => void;
  clearHighlight: (field: string) => void;
  reset: () => void;
}

const initialFields: RequestFields = {
  entityType: null,
  serviceCategory: null,
  serviceSubcategory: null,
  businessType: null,
  originLocation: null,
  destinationLocation: null,
  frequency: null,
  urgency: null,
  specialRequirements: [],
  additionalNotes: null,
  currentCourier: null,
  supplierStatus: null,
  supplierCountry: null,
  goodsCategory: null,
  incoterms: null,
  cargoVolume: null,
  customsRequired: null,
  storageType: null,
  contactName: null,
  contactEmail: null,
  contactPhone: null,
  companyName: null,
};

export const useRequestStore = create<RequestState>()(
  persist(
    (set, get) => ({
      ...initialFields,
      recommendedServices: [],
      stage: 'empty',
      completionPercent: 0,
      referenceNumber: null,
      highlightedFields: new Set(),

      updateField: (field, value) => {
        const prev = get()[field];
        set({ [field]: value } as Partial<RequestState>);
        get().computeCompletion();

        // Trigger highlight if the value actually changed
        const changed = Array.isArray(prev)
          ? JSON.stringify(prev) !== JSON.stringify(value)
          : prev !== value;

        if (changed && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          get().highlightField(field);
        }
      },

      setRecommendedServices: (services) => set({ recommendedServices: services }),
      setStage: (stage) => set({ stage }),
      setReferenceNumber: (ref) => set({ referenceNumber: ref }),

      highlightField: (field) => {
        set((state) => {
          const next = new Set(state.highlightedFields);
          next.add(field);
          return { highlightedFields: next };
        });
        // Auto-clear after animation
        setTimeout(() => {
          get().clearHighlight(field);
        }, 2000);
      },

      clearHighlight: (field) =>
        set((state) => {
          const next = new Set(state.highlightedFields);
          next.delete(field);
          return { highlightedFields: next };
        }),

      computeCompletion: () => {
        const state = get();
        const fields: (keyof RequestFields)[] = [
          'serviceCategory',
          'serviceSubcategory',
          'urgency',
          'businessType',
          'originLocation',
          'contactName',
          'contactEmail',
          'companyName',
        ];
        const filled = fields.filter((f) => {
          const v = state[f];
          return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
        }).length;
        set({ completionPercent: Math.round((filled / fields.length) * 100) });
      },

      reset: () =>
        set({
          ...initialFields,
          recommendedServices: [],
          stage: 'empty',
          completionPercent: 0,
          referenceNumber: null,
          highlightedFields: new Set(),
        }),
    }),
    {
      name: '7x-request',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => {
        // Exclude non-serializable (Set) and transient fields
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { highlightedFields, ...rest } = state;
        // Also exclude functions — they'll be re-provided by Zustand
        const data: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(rest)) {
          if (typeof value !== 'function') {
            data[key] = value;
          }
        }
        return data;
      },
    }
  )
);
