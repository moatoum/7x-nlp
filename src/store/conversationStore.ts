'use client';

import { create } from 'zustand';
import type { Message, ChipOption } from '@/engine/types';

interface ConversationState {
  messages: Message[];
  currentNodeId: string;
  visitedNodes: string[];
  isTyping: boolean;
  inputDisabled: boolean;
  started: boolean;
  startedAt: number;

  addBotMessage: (content: string, chips?: ChipOption[], multiSelect?: boolean) => void;
  addBotMessageWithCards: (content: string, cards: Message['serviceCards']) => void;
  addUserMessage: (content: string) => void;
  setTyping: (typing: boolean) => void;
  setInputDisabled: (disabled: boolean) => void;
  transitionTo: (nodeId: string) => void;
  setStarted: (started: boolean) => void;
  reset: () => void;
}

let msgCounter = 0;
const makeId = () => `msg-${++msgCounter}-${Date.now()}`;

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  currentNodeId: 'welcome',
  visitedNodes: [],
  isTyping: false,
  inputDisabled: false,
  started: false,
  startedAt: 0,

  addBotMessage: (content, chips, multiSelect) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: makeId(),
          role: 'bot',
          content,
          timestamp: Date.now(),
          chips,
          multiSelect,
        },
      ],
    })),

  addBotMessageWithCards: (content, serviceCards) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: makeId(),
          role: 'bot',
          content,
          timestamp: Date.now(),
          serviceCards,
        },
      ],
    })),

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: makeId(),
          role: 'user',
          content,
          timestamp: Date.now(),
        },
      ],
    })),

  setTyping: (typing) => set({ isTyping: typing }),
  setInputDisabled: (disabled) => set({ inputDisabled: disabled }),

  transitionTo: (nodeId) =>
    set((state) => ({
      currentNodeId: nodeId,
      visitedNodes: [...state.visitedNodes, nodeId],
    })),

  setStarted: (started) => set({ started, startedAt: started ? Date.now() : 0 }),

  reset: () => {
    msgCounter = 0;
    set({
      messages: [],
      currentNodeId: 'welcome',
      visitedNodes: [],
      isTyping: false,
      inputDisabled: false,
      started: false,
      startedAt: 0,
    });
  },
}));
