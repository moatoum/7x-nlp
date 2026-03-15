'use client';

import { create } from 'zustand';
import type { RequestFields, RequestStage, ServiceMatch } from '@/engine/types';

interface RequestState extends RequestFields {
  recommendedServices: ServiceMatch[];
  stage: RequestStage;
  completionPercent: number;
  referenceNumber: string | null;

  updateField: (field: keyof RequestFields, value: string | string[] | null) => void;
  setRecommendedServices: (services: ServiceMatch[]) => void;
  setStage: (stage: RequestStage) => void;
  computeCompletion: () => void;
  setReferenceNumber: (ref: string) => void;
  reset: () => void;
}

const initialFields: RequestFields = {
  serviceCategory: null,
  serviceSubcategory: null,
  businessType: null,
  originLocation: null,
  destinationLocation: null,
  frequency: null,
  urgency: null,
  specialRequirements: [],
  additionalNotes: null,
  contactName: null,
  contactEmail: null,
  contactPhone: null,
  companyName: null,
};

export const useRequestStore = create<RequestState>((set, get) => ({
  ...initialFields,
  recommendedServices: [],
  stage: 'empty',
  completionPercent: 0,
  referenceNumber: null,

  updateField: (field, value) => {
    set({ [field]: value } as Partial<RequestState>);
    get().computeCompletion();
  },

  setRecommendedServices: (services) => set({ recommendedServices: services }),
  setStage: (stage) => set({ stage }),
  setReferenceNumber: (ref) => set({ referenceNumber: ref }),

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
    }),
}));
