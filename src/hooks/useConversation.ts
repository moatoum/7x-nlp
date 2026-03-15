'use client';

import { useCallback } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { useRequestStore } from '@/store/requestStore';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { getNode, processUserInput } from '@/engine/engine';
import { matchServices } from '@/engine/matcher';
import { scoreServicesFromFields } from '@/engine/ai';
import type { AIResponse } from '@/engine/ai';
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

// Determine a reasonable node ID based on what fields are filled
function inferNodeFromFields(fields: Partial<RequestFields>): string {
  if (fields.contactName && fields.contactEmail && fields.companyName) return 'review';
  if (fields.companyName || fields.contactEmail) return 'contact_company';
  if (fields.contactName) return 'contact_email';
  if (fields.originLocation) return 'recommendation';
  if (fields.businessType) return 'origin_location';
  if (fields.specialRequirements && fields.specialRequirements.length > 0) return 'business_type';
  if (fields.urgency) return 'special_requirements';
  if (fields.destinationLocation) return 'urgency';
  if (fields.serviceSubcategory) return 'ship_destination';
  if (fields.serviceCategory) return 'ship_destination';
  return 'welcome';
}

// ============================================================
// TYPEWRITER EFFECT — streams text word-by-word
// ============================================================
async function typewriterStream(
  messageId: string,
  text: string,
  speed: number = 30
): Promise<void> {
  const words = text.split(/(\s+)/); // preserve whitespace
  for (const word of words) {
    useConversationStore.getState().appendToStreamingMessage(messageId, word);
    // Vary speed slightly for natural feel
    const jitter = speed * (0.5 + Math.random());
    await delay(jitter);
  }
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

    convStore.addUserMessage(chipLabel);
    convStore.setInputDisabled(true);
    convStore.setTyping(true);

    if (reqStore.stage === 'empty') {
      reqStore.setStage('gathering');
    }

    const { nextNodeId, fieldUpdate } = processUserInput(chip, currentNode, reqStore as RequestFields);

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

  // ============================================================
  // AI-POWERED TEXT HANDLING WITH STREAMING
  // ============================================================
  const handleTextSubmit = useCallback(async (text: string) => {
    const convStore = useConversationStore.getState();
    const reqStore = useRequestStore.getState();

    convStore.addUserMessage(text);
    convStore.setInputDisabled(true);
    convStore.setTyping(true);

    if (reqStore.stage === 'empty') {
      reqStore.setStage('gathering');
    }

    // Build current fields snapshot
    const currentFields: Partial<RequestFields> = {
      serviceCategory: reqStore.serviceCategory,
      serviceSubcategory: reqStore.serviceSubcategory,
      businessType: reqStore.businessType,
      originLocation: reqStore.originLocation,
      destinationLocation: reqStore.destinationLocation,
      frequency: reqStore.frequency,
      urgency: reqStore.urgency,
      specialRequirements: reqStore.specialRequirements,
      additionalNotes: reqStore.additionalNotes,
      contactName: reqStore.contactName,
      contactEmail: reqStore.contactEmail,
      contactPhone: reqStore.contactPhone,
      companyName: reqStore.companyName,
    };

    // Build conversation history for AI
    const allMessages = useConversationStore.getState().messages;
    const chatHistory = allMessages
      .filter((m) => m.content.trim() !== '')
      .map((m) => ({
        role: (m.role === 'bot' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.content,
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          currentFields,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const aiResponse: AIResponse = await response.json();

      // Apply extracted fields to the request store (triggers highlight)
      if (aiResponse.extractedFields) {
        const rs = useRequestStore.getState();
        for (const [field, value] of Object.entries(aiResponse.extractedFields)) {
          if (value !== null && value !== undefined && value !== '') {
            rs.updateField(field as keyof RequestFields, value as string | string[] | null);
          }
        }
      }

      // Build suggested chips from AI response
      const suggestedChips: ChipOption[] | undefined = aiResponse.suggestedOptions?.map((opt) => ({
        id: opt.id,
        label: opt.label,
      }));

      const cs = useConversationStore.getState();
      cs.setTyping(false);

      // === STREAMING TYPEWRITER EFFECT ===
      const msgId = cs.addStreamingBotMessage();

      // Handle recommendations
      if (aiResponse.shouldShowRecommendations) {
        const rs = useRequestStore.getState();
        let matches = scoreServicesFromFields(rs as RequestFields);
        if (matches.length === 0) {
          matches = matchServices(rs as RequestFields);
        }

        if (matches.length > 0) {
          rs.setRecommendedServices(matches);
          rs.setStage('matched');
          await typewriterStream(msgId, aiResponse.message);
          useConversationStore.getState().finalizeStreamingMessage(msgId, undefined, matches);
        } else {
          await typewriterStream(msgId, aiResponse.message);
          useConversationStore.getState().finalizeStreamingMessage(msgId, suggestedChips);
        }
      } else if (aiResponse.allFieldsComplete) {
        // All contact fields captured — move to review
        useRequestStore.getState().setStage('review');
        await typewriterStream(msgId, aiResponse.message);
        useConversationStore.getState().finalizeStreamingMessage(msgId, [
          { id: 'submit', label: 'Submit Request' },
          { id: 'edit', label: 'I want to change something' },
        ]);
        const cs2 = useConversationStore.getState();
        cs2.transitionTo('review');
        cs2.setInputDisabled(false);
        return;
      } else {
        await typewriterStream(msgId, aiResponse.message);
        useConversationStore.getState().finalizeStreamingMessage(msgId, suggestedChips);
      }

      // Sync the conversation node for consistency
      const newNodeId = inferNodeFromFields(useRequestStore.getState());
      useConversationStore.getState().transitionTo(newNodeId);
      useConversationStore.getState().setInputDisabled(false);
    } catch (error) {
      console.error('AI chat error:', error);
      // Fallback to rule-based engine
      await handleTextFallback(text);
    }
  }, []);

  // Rule-based fallback when AI is unavailable
  const handleTextFallback = useCallback(async (text: string) => {
    const convStore = useConversationStore.getState();
    const reqStore = useRequestStore.getState();
    const currentNode = getNode(convStore.currentNodeId);

    const { nextNodeId, fieldUpdate } = processUserInput(text, currentNode, reqStore as RequestFields);

    if (fieldUpdate) {
      for (const [field, value] of Object.entries(fieldUpdate)) {
        useRequestStore.getState().updateField(field as keyof RequestFields, value as string | string[] | null);
      }
    }

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

    if (currentNode.capturesField) {
      reqStore.updateField(currentNode.capturesField, selectedLabels);
    }

    await delay(randomDelay());

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
