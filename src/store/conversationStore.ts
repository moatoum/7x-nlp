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
  streamingMessageId: string | null;

  addBotMessage: (content: string, chips?: ChipOption[], multiSelect?: boolean) => void;
  addBotMessageWithCards: (content: string, cards: Message['serviceCards']) => void;
  addUserMessage: (content: string) => void;
  // Streaming support
  addStreamingBotMessage: () => string;
  appendToStreamingMessage: (id: string, text: string) => void;
  finalizeStreamingMessage: (id: string, chips?: ChipOption[], serviceCards?: Message['serviceCards']) => void;
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
  streamingMessageId: null,

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

  // Create an empty bot message for streaming
  addStreamingBotMessage: () => {
    const id = makeId();
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id,
          role: 'bot',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        },
      ],
      streamingMessageId: id,
    }));
    return id;
  },

  // Append text to the streaming message
  appendToStreamingMessage: (id, text) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + text } : m
      ),
    })),

  // Finalize streaming — add chips/cards, mark complete
  finalizeStreamingMessage: (id, chips, serviceCards) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id
          ? { ...m, isStreaming: false, chips, serviceCards }
          : m
      ),
      streamingMessageId: null,
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
      streamingMessageId: null,
    });
  },
}));
