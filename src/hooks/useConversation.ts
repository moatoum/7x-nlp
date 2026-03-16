'use client';

import { useCallback } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { useRequestStore } from '@/store/requestStore';
import { useSubmissionsStore } from '@/store/submissionsStore';
import { getNode, processUserInput } from '@/engine/engine';
import { matchServices } from '@/engine/matcher';
import { lookupServicesByIds } from '@/engine/ai';
import type { AIResponse } from '@/engine/ai';
import type { ChipOption, RequestFields, ServiceMatch } from '@/engine/types';

const MAX_CHAT_HISTORY = 30;

/** Call AI API to get recommended service IDs, with rule-based fallback */
async function fetchAIRecommendations(fields: RequestFields): Promise<ServiceMatch[]> {
  try {
    // Build minimal chat history context for the AI
    const allMessages = useConversationStore.getState().messages;
    const chatHistory = allMessages
      .filter((m) => m.content.trim() !== '')
      .slice(-MAX_CHAT_HISTORY)
      .map((m) => ({
        role: (m.role === 'bot' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.content,
      }));

    const currentFields: Partial<RequestFields> = {
      serviceCategory: fields.serviceCategory,
      serviceSubcategory: fields.serviceSubcategory,
      businessType: fields.businessType,
      originLocation: fields.originLocation,
      destinationLocation: fields.destinationLocation,
      frequency: fields.frequency,
      urgency: fields.urgency,
      specialRequirements: fields.specialRequirements,
      additionalNotes: fields.additionalNotes,
    };

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          ...chatHistory,
          { role: 'user', content: 'Based on everything I told you, please recommend the most relevant services.' },
        ],
        currentFields,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const aiResponse: AIResponse = await response.json();
    if (aiResponse.recommendedServiceIds && aiResponse.recommendedServiceIds.length > 0) {
      const matches = lookupServicesByIds(aiResponse.recommendedServiceIds);
      if (matches.length > 0) return matches;
    }
  } catch (error) {
    console.error('AI recommendation failed, falling back to rule-based:', error);
  }
  // Fallback to rule-based
  return matchServices(fields as RequestFields);
}

/** Check if all required fields are captured; return first missing fill-node ID or null */
function findMissingFieldNode(rs: Partial<RequestFields>): string | null {
  if (!rs.destinationLocation) return '_fill_destination';
  if (!rs.urgency) return '_fill_urgency';
  if (!rs.businessType) return '_fill_business_type';
  if (!rs.frequency) return '_fill_volume';
  if (!rs.originLocation) return '_fill_origin';
  return null;
}

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
    notes: [],
  });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate required fields and submit, or redirect to missing field
async function handleSubmission(): Promise<boolean> {
  const rs = useRequestStore.getState();
  const cs = useConversationStore.getState();

  const missingFields: string[] = [];
  if (!rs.contactName) missingFields.push('name');
  if (!rs.contactEmail) missingFields.push('email');
  if (!rs.contactPhone) missingFields.push('phone number');
  if (!rs.companyName) missingFields.push('company name');

  if (missingFields.length > 0) {
    cs.setTyping(false);
    cs.addBotMessage(
      `Before I can submit, I still need your ${missingFields.join(', ')}. Could you provide that?`
    );
    const firstMissing = !rs.contactName ? 'contact_name' : !rs.contactEmail ? 'contact_email' : !rs.contactPhone ? 'contact_phone' : 'contact_company';
    cs.transitionTo(firstMissing);
    cs.setInputDisabled(false);
    return false;
  }

  if (rs.contactEmail && !EMAIL_REGEX.test(rs.contactEmail)) {
    cs.setTyping(false);
    cs.addBotMessage(
      `The email "${rs.contactEmail}" doesn't look valid. Could you provide a valid email?`
    );
    cs.transitionTo('contact_email');
    cs.setInputDisabled(false);
    return false;
  }

  const refNumber = generateRefNumber();
  rs.setReferenceNumber(refNumber);
  rs.setStage('submitted');
  cs.setTyping(false);
  cs.addBotMessage(
    `Your request has been submitted successfully.\n\nReference: ${refNumber}\n\nA confirmation email has been sent to ${rs.contactEmail}. Our logistics specialists will reach out within 2 business hours. Thank you for choosing 7X.`
  );
  cs.transitionTo('submitted');
  cs.setInputDisabled(true);
  persistSubmission(refNumber);

  // Send confirmation email (fire and forget)
  sendConfirmationEmail(refNumber, rs);

  return true;
}

async function sendConfirmationEmail(refNumber: string, rs: ReturnType<typeof useRequestStore.getState>) {
  try {
    await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceNumber: refNumber,
        contactName: rs.contactName,
        contactEmail: rs.contactEmail,
        contactPhone: rs.contactPhone,
        companyName: rs.companyName,
        serviceCategory: rs.serviceCategory,
        serviceSubcategory: rs.serviceSubcategory,
        originLocation: rs.originLocation,
        destinationLocation: rs.destinationLocation,
        urgency: rs.urgency,
        frequency: rs.frequency,
        specialRequirements: rs.specialRequirements || [],
        recommendedServices: (rs.recommendedServices || []).map((s) => ({
          name: s.name,
          category: s.category,
        })),
      }),
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}

// Determine a reasonable node ID based on what fields are filled
function inferNodeFromFields(fields: Partial<RequestFields>): string {
  if (fields.contactName && fields.contactEmail && fields.contactPhone && fields.companyName) return 'review';
  if (fields.contactName && fields.contactEmail && fields.contactPhone) return 'contact_company';
  if (fields.contactName && fields.contactEmail) return 'contact_phone';
  if (fields.contactName) return 'contact_email';
  // Only jump to recommendation when all core fields are gathered
  const hasCoreFields =
    fields.serviceCategory && fields.serviceSubcategory &&
    fields.originLocation && fields.destinationLocation &&
    fields.urgency && fields.businessType && fields.frequency;
  if (hasCoreFields) return 'recommendation';
  if (fields.frequency) return 'business_type';
  if (fields.businessType) return 'frequency';
  if (fields.originLocation) return 'urgency';
  if (fields.specialRequirements && fields.specialRequirements.length > 0) return 'business_type';
  if (fields.urgency) return 'special_requirements';
  if (fields.destinationLocation) return 'origin_location';
  if (fields.serviceSubcategory) return 'ship_destination';
  if (fields.serviceCategory) return 'ship_destination';
  return 'welcome';
}

// ============================================================
// TYPEWRITER EFFECT — streams text in small batches for performance
// ============================================================
async function typewriterStream(
  messageId: string,
  text: string,
  speed: number = 30
): Promise<void> {
  const words = text.split(/(\s+)/); // preserve whitespace
  const BATCH_SIZE = 3; // Process 3 tokens at a time to reduce re-renders
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE).join('');
    useConversationStore.getState().appendToStreamingMessage(messageId, batch);
    const jitter = speed * (0.5 + Math.random()) * BATCH_SIZE;
    await delay(jitter);
  }
}

// MAX_CHAT_HISTORY defined at top of file

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
      await handleSubmission();
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

      // Guard: ensure all required fields are captured before recommending
      const missingNode = findMissingFieldNode(rs);
      if (missingNode) {
        const fallbackNode = getNode(missingNode);
        const fallbackMsg = typeof fallbackNode.message === 'function'
          ? fallbackNode.message(rs as RequestFields)
          : fallbackNode.message;
        const cs = useConversationStore.getState();
        cs.setTyping(false);
        cs.addBotMessage(fallbackMsg, fallbackNode.chips, fallbackNode.multiSelect);
        cs.transitionTo(missingNode);
        cs.setInputDisabled(false);
        return;
      }

      rs.setStage('matched');

      // Show analyzing message while AI works
      const cs = useConversationStore.getState();
      cs.setTyping(false);
      const analyzingId = cs.addStreamingBotMessage();
      await typewriterStream(analyzingId, "I'm analyzing your request and suggesting relevant services... One moment.");
      useConversationStore.getState().finalizeStreamingMessage(analyzingId);

      // Fetch AI recommendations
      const matches = await fetchAIRecommendations(rs as RequestFields);

      const recMsg = 'Based on your requirements, here are the services I recommend:';

      const cs2 = useConversationStore.getState();
      cs2.addBotMessageWithCards(recMsg + '\n\nPlease select the services you need, then confirm.', matches);
      cs2.transitionTo('recommendation');
      cs2.setInputDisabled(true);
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

    // Build conversation history for AI (bounded to last N messages)
    const allMessages = useConversationStore.getState().messages;
    const chatHistory = allMessages
      .filter((m) => m.content.trim() !== '')
      .slice(-MAX_CHAT_HISTORY)
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
        // Show specific message for rate limits
        if (response.status === 429) {
          const cs = useConversationStore.getState();
          cs.setTyping(false);
          cs.addBotMessage("I'm receiving a lot of requests right now. Please wait a moment and try again.");
          cs.setInputDisabled(false);
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const aiResponse: AIResponse = await response.json();

      // Guard against empty AI message
      if (!aiResponse.message || aiResponse.message.trim() === '') {
        aiResponse.message = "Could you tell me more about what you're looking for?";
      }

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

      // Handle recommendations — AI returns specific service IDs
      const rs = useRequestStore.getState();
      const hasEnoughForRecs =
        !!rs.serviceCategory &&
        !!rs.originLocation &&
        !!rs.destinationLocation &&
        !!rs.urgency &&
        !!rs.businessType &&
        !!rs.frequency;

      if (aiResponse.shouldShowRecommendations && hasEnoughForRecs) {
        // Look up services by AI-returned IDs
        let matches: ServiceMatch[] = [];
        if (aiResponse.recommendedServiceIds && aiResponse.recommendedServiceIds.length > 0) {
          matches = lookupServicesByIds(aiResponse.recommendedServiceIds);
        }
        // Fallback to rule-based if AI returned no valid IDs
        if (matches.length === 0) {
          matches = matchServices(rs as RequestFields);
        }

        if (matches.length > 0) {
          rs.setStage('matched');
          // Show analyzing message
          await typewriterStream(msgId, "I'm analyzing your request and suggesting relevant services... One moment.");
          useConversationStore.getState().finalizeStreamingMessage(msgId);

          // Then show the cards in a new message
          await delay(600);
          const cs3 = useConversationStore.getState();
          cs3.addBotMessageWithCards('Based on your requirements, here are the services I recommend:\n\nPlease select the services you need, then confirm.', matches);
          cs3.transitionTo('recommendation');
          cs3.setInputDisabled(true);
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
      if (!aiResponse.shouldShowRecommendations || !hasEnoughForRecs) {
        useConversationStore.getState().setInputDisabled(false);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      // Fallback to rule-based engine
      await handleTextFallback(text);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rule-based fallback when AI is unavailable
  const handleTextFallback = useCallback(async (text: string) => {
    try {
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
        await handleSubmission();
        return;
      }

      const nextNode = getNode(nextNodeId);

      if (nextNode.type === 'recommendation') {
        const rs = useRequestStore.getState();

        const missingNode = findMissingFieldNode(rs);
        if (missingNode) {
          const fallbackNode = getNode(missingNode);
          const fallbackMsg = typeof fallbackNode.message === 'function'
            ? fallbackNode.message(rs as RequestFields)
            : fallbackNode.message;
          const cs = useConversationStore.getState();
          cs.setTyping(false);
          cs.addBotMessage(fallbackMsg, fallbackNode.chips, fallbackNode.multiSelect);
          cs.transitionTo(missingNode);
          cs.setInputDisabled(false);
          return;
        }

        rs.setStage('matched');

        const cs = useConversationStore.getState();
        cs.setTyping(false);
        const analyzingId = cs.addStreamingBotMessage();
        await typewriterStream(analyzingId, "I'm analyzing your request and suggesting relevant services... One moment.");
        useConversationStore.getState().finalizeStreamingMessage(analyzingId);

        const matches = await fetchAIRecommendations(rs as RequestFields);

        const recMsg = 'Based on your requirements, here are the services I recommend:';

        const cs2 = useConversationStore.getState();
        cs2.addBotMessageWithCards(recMsg + '\n\nPlease select the services you need, then confirm.', matches);
        cs2.transitionTo('recommendation');
        cs2.setInputDisabled(true);
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
    } catch (error) {
      console.error('Fallback engine error:', error);
      const cs = useConversationStore.getState();
      cs.setTyping(false);
      cs.addBotMessage("I'm sorry, something went wrong. Could you try rephrasing that?");
      cs.setInputDisabled(false);
    }
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

  // ============================================================
  // SERVICE SELECTION CONFIRMATION
  // ============================================================
  const handleServiceConfirm = useCallback(async (selectedServices: ServiceMatch[]) => {
    const rs = useRequestStore.getState();
    const cs = useConversationStore.getState();

    // Store selected services
    rs.setRecommendedServices(selectedServices);

    // Show what user selected
    cs.addUserMessage(
      `Selected: ${selectedServices.map((s) => s.name).join(', ')}`
    );
    cs.setInputDisabled(true);
    cs.setTyping(true);

    await delay(randomDelay());

    // Ask for contact details
    const cs2 = useConversationStore.getState();
    cs2.setTyping(false);
    const followId = cs2.addStreamingBotMessage();
    await typewriterStream(followId, "Great choices. To submit your request, I'll need a few contact details.\n\nWhat's your full name?");
    useConversationStore.getState().finalizeStreamingMessage(followId);
    useConversationStore.getState().transitionTo('contact_name');
    useConversationStore.getState().setInputDisabled(false);
  }, []);

  return {
    startConversation,
    handleChipSelect,
    handleTextSubmit,
    handleMultiSelect,
    handleServiceConfirm,
  };
}
