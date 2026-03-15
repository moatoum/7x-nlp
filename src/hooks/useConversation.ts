'use client';

import { useCallback } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { useRequestStore } from '@/store/requestStore';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { getNode, processUserInput } from '@/engine/engine';
import { matchServices } from '@/engine/matcher';
import type { ChipOption, RequestFields } from '@/engine/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return 400 + Math.random() * 500;
}

function generateRefNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `7X-${date}-${code}`;
}

function persistSubmission(refNumber: string) {
  const req = useRequestStore.getState();
  const conv = useConversationStore.getState();
  useSubmissionsStore.getState().addSubmission({
    id: crypto.randomUUID(),
    referenceNumber: refNumber,
    status: 'submitted',
    createdAt: Date.now(),
    serviceCategory: req.serviceCategory,
    serviceSubcategory: req.serviceSubcategory,
    businessType: req.businessType,
    originLocation: req.originLocation,
    destinationLocation: req.destinationLocation,
    frequency: req.frequency,
    urgency: req.urgency,
    specialRequirements: req.specialRequirements,
    additionalNotes: req.additionalNotes,
    contactName: req.contactName,
    contactEmail: req.contactEmail,
    contactPhone: req.contactPhone,
    companyName: req.companyName,
    recommendedServices: req.recommendedServices,
    conversationDuration: conv.startedAt ? Date.now() - conv.startedAt : 0,
    nodesVisited: conv.visitedNodes,
    totalMessages: conv.messages.length,
  });
}

export function useConversation() {
  const startConversation = useCallback(async () => {
    const conv = useConversationStore.getState();
    if (conv.started) return;
    conv.setStarted(true);

    conv.setTyping(true);
    conv.setInputDisabled(true);
    await delay(600);

    const req = useRequestStore.getState();
    const welcomeNode = getNode('welcome');
    const msg = typeof welcomeNode.message === 'function'
      ? welcomeNode.message(req as RequestFields)
      : welcomeNode.message;

    const c = useConversationStore.getState();
    c.setTyping(false);
    c.addBotMessage(msg, welcomeNode.chips, welcomeNode.multiSelect);
    c.transitionTo('welcome');
    c.setInputDisabled(false);
  }, []);

  const handleChipSelect = useCallback(async (chipId: string, chipLabel: string) => {
    const convStore = useConversationStore.getState();
    const reqStore = useRequestStore.getState();
    const currentNode = getNode(convStore.currentNodeId);
    const chip: ChipOption = { id: chipId, label: chipLabel };

    // Show user message
    convStore.addUserMessage(chipLabel);
    convStore.setInputDisabled(true);
    convStore.setTyping(true);

    // Set gathering stage on first interaction
    if (reqStore.stage === 'empty') {
      reqStore.setStage('gathering');
    }

    // Process through engine
    const { nextNodeId, fieldUpdate } = processUserInput(chip, currentNode, reqStore as RequestFields);

    // Apply field updates
    if (fieldUpdate) {
      for (const [field, value] of Object.entries(fieldUpdate)) {
        useRequestStore.getState().updateField(field as keyof RequestFields, value as string | string[] | null);
      }
    }

    await delay(randomDelay());

    // Handle submission
    if (nextNodeId === 'submitted') {
      const refNumber = generateRefNumber();
      const rs = useRequestStore.getState();
      rs.setReferenceNumber(refNumber);
      rs.setStage('submitted');
      const cs = useConversationStore.getState();
      cs.setTyping(false);
      cs.addBotMessage(
        `Your request has been submitted successfully.\n\nReference: ${refNumber}\n\nOur logistics specialists will reach out within 2 business hours. Thank you for choosing 7X.`
      );
      cs.transitionTo('submitted');
      cs.setInputDisabled(true);
      persistSubmission(refNumber);
      return;
    }

    // Handle restart
    if (nextNodeId === 'welcome') {
      useConversationStore.getState().reset();
      useRequestStore.getState().reset();
      useConversationStore.getState().setStarted(true);

      await delay(300);

      const rs = useRequestStore.getState();
      const welcomeNode = getNode('welcome');
      const msg = typeof welcomeNode.message === 'function'
        ? welcomeNode.message(rs as RequestFields)
        : welcomeNode.message;
      const cs = useConversationStore.getState();
      cs.setTyping(false);
      cs.addBotMessage(msg, welcomeNode.chips);
      cs.transitionTo('welcome');
      cs.setInputDisabled(false);
      useRequestStore.getState().setStage('gathering');
      return;
    }

    const nextNode = getNode(nextNodeId);

    // Handle recommendation node — run matcher
    if (nextNode.type === 'recommendation') {
      const rs = useRequestStore.getState();
      const matches = matchServices(rs as RequestFields);
      rs.setRecommendedServices(matches);
      rs.setStage('matched');

      const recMsg = typeof nextNode.message === 'function'
        ? nextNode.message(rs as RequestFields)
        : nextNode.message;

      const cs = useConversationStore.getState();
      cs.setTyping(false);
      cs.addBotMessageWithCards(recMsg, matches);
      cs.transitionTo(nextNodeId);

      // Then show the follow-up question
      await delay(800);
      useConversationStore.getState().setTyping(true);
      await delay(randomDelay());

      const responseNode = getNode('recommendation_response');
      const responseMsg = typeof responseNode.message === 'function'
        ? responseNode.message(useRequestStore.getState() as RequestFields)
        : responseNode.message;

      const cs2 = useConversationStore.getState();
      cs2.setTyping(false);
      cs2.addBotMessage(responseMsg, responseNode.chips);
      cs2.transitionTo('recommendation_response');
      cs2.setInputDisabled(false);
      return;
    }

    // Handle review node
    if (nextNodeId === 'review') {
      useRequestStore.getState().setStage('review');
    }

    // Show next node message
    const msg = typeof nextNode.message === 'function'
      ? nextNode.message(useRequestStore.getState() as RequestFields)
      : nextNode.message;

    const cs = useConversationStore.getState();
    cs.setTyping(false);
    cs.addBotMessage(msg, nextNode.chips, nextNode.multiSelect);
    cs.transitionTo(nextNodeId);
    cs.setInputDisabled(false);
  }, []);

  const handleTextSubmit = useCallback(async (text: string) => {
    const convStore = useConversationStore.getState();
    const reqStore = useRequestStore.getState();
    const currentNode = getNode(convStore.currentNodeId);

    convStore.addUserMessage(text);
    convStore.setInputDisabled(true);
    convStore.setTyping(true);

    // Set gathering stage on first interaction
    if (reqStore.stage === 'empty') {
      reqStore.setStage('gathering');
    }

    const { nextNodeId, fieldUpdate } = processUserInput(text, currentNode, reqStore as RequestFields);

    if (fieldUpdate) {
      for (const [field, value] of Object.entries(fieldUpdate)) {
        useRequestStore.getState().updateField(field as keyof RequestFields, value as string | string[] | null);
      }
    }

    await delay(randomDelay());

    if (nextNodeId === 'submitted') {
      const refNumber = generateRefNumber();
      const rs = useRequestStore.getState();
      rs.setReferenceNumber(refNumber);
      rs.setStage('submitted');
      const cs = useConversationStore.getState();
      cs.setTyping(false);
      cs.addBotMessage(
        `Your request has been submitted successfully.\n\nReference: ${refNumber}\n\nOur logistics specialists will reach out within 2 business hours. Thank you for choosing 7X.`
      );
      cs.transitionTo('submitted');
      cs.setInputDisabled(true);
      persistSubmission(refNumber);
      return;
    }

    const nextNode = getNode(nextNodeId);

    if (nextNode.type === 'recommendation') {
      const rs = useRequestStore.getState();
      const matches = matchServices(rs as RequestFields);
      rs.setRecommendedServices(matches);
      rs.setStage('matched');

      const recMsg = typeof nextNode.message === 'function'
        ? nextNode.message(rs as RequestFields)
        : nextNode.message;

      const cs = useConversationStore.getState();
      cs.setTyping(false);
      cs.addBotMessageWithCards(recMsg, matches);
      cs.transitionTo(nextNodeId);

      await delay(800);
      useConversationStore.getState().setTyping(true);
      await delay(randomDelay());

      const responseNode = getNode('recommendation_response');
      const responseMsg = typeof responseNode.message === 'function'
        ? responseNode.message(useRequestStore.getState() as RequestFields)
        : responseNode.message;

      const cs2 = useConversationStore.getState();
      cs2.setTyping(false);
      cs2.addBotMessage(responseMsg, responseNode.chips);
      cs2.transitionTo('recommendation_response');
      cs2.setInputDisabled(false);
      return;
    }

    if (nextNodeId === 'review') {
      useRequestStore.getState().setStage('review');
    }

    const msg = typeof nextNode.message === 'function'
      ? nextNode.message(useRequestStore.getState() as RequestFields)
      : nextNode.message;

    const cs = useConversationStore.getState();
    cs.setTyping(false);
    cs.addBotMessage(msg, nextNode.chips, nextNode.multiSelect);
    cs.transitionTo(nextNodeId);
    cs.setInputDisabled(false);
  }, []);

  const handleMultiSelect = useCallback(async (selectedLabels: string[]) => {
    const convStore = useConversationStore.getState();
    const reqStore = useRequestStore.getState();
    const currentNode = getNode(convStore.currentNodeId);

    convStore.addUserMessage(selectedLabels.join(', '));
    convStore.setInputDisabled(true);
    convStore.setTyping(true);

    // Capture multi-select values
    if (currentNode.capturesField) {
      reqStore.updateField(currentNode.capturesField, selectedLabels);
    }

    await delay(randomDelay());

    // Find next node via 'any' edge
    const anyEdge = currentNode.edges.find((e) => e.condition === 'any');
    const nextNodeId = anyEdge?.targetNodeId || 'business_type';
    const nextNode = getNode(nextNodeId);

    const msg = typeof nextNode.message === 'function'
      ? nextNode.message(useRequestStore.getState() as RequestFields)
      : nextNode.message;

    const cs = useConversationStore.getState();
    cs.setTyping(false);
    cs.addBotMessage(msg, nextNode.chips, nextNode.multiSelect);
    cs.transitionTo(nextNodeId);
    cs.setInputDisabled(false);
  }, []);

  return {
    startConversation,
    handleChipSelect,
    handleTextSubmit,
    handleMultiSelect,
  };
}
