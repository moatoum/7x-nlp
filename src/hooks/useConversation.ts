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
      supplierStatus: fields.supplierStatus,
      supplierCountry: fields.supplierCountry,
      goodsCategory: fields.goodsCategory,
      incoterms: fields.incoterms,
      cargoVolume: fields.cargoVolume,
      customsRequired: fields.customsRequired,
      storageType: fields.storageType,
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
  const cat = (rs.serviceCategory || '').toLowerCase();
  const isWarehousing = cat.includes('warehouse') || cat.includes('fulfilment') || cat.includes('fulfillment') || cat.includes('store');
  const isCustoms = cat.includes('customs') || cat.includes('trade');
  const isPostal = cat.includes('postal') || cat.includes('mail');
  const isReturns = cat.includes('return') || cat.includes('repair');
  const skipDestination = isWarehousing || isCustoms || isPostal || isReturns;
  const skipUrgency = isWarehousing || isCustoms || isPostal;

  if (!skipDestination && !rs.destinationLocation) return '_fill_destination';
  if (!skipUrgency && !rs.urgency) return '_fill_urgency';
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

async function persistSubmission(refNumber: string) {
  const req = useRequestStore.getState();
  const conv = useConversationStore.getState();

  const payload = {
    id: crypto.randomUUID(),
    referenceNumber: refNumber,
    status: 'submitted' as const,
    createdAt: Date.now(),
    entityType: req.entityType,
    serviceCategory: req.serviceCategory,
    serviceSubcategory: req.serviceSubcategory,
    businessType: req.businessType,
    originLocation: req.originLocation,
    destinationLocation: req.destinationLocation,
    frequency: req.frequency,
    urgency: req.urgency,
    specialRequirements: req.specialRequirements,
    additionalNotes: req.additionalNotes,
    currentCourier: req.currentCourier,
    supplierStatus: req.supplierStatus,
    supplierCountry: req.supplierCountry,
    goodsCategory: req.goodsCategory,
    incoterms: req.incoterms,
    cargoVolume: req.cargoVolume,
    customsRequired: req.customsRequired,
    storageType: req.storageType,
    contactName: req.contactName,
    contactEmail: req.contactEmail,
    contactPhone: req.contactPhone,
    companyName: req.companyName,
    tag: null,
    recommendedServices: req.recommendedServices,
    conversationDuration: conv.startedAt ? Date.now() - conv.startedAt : 0,
    nodesVisited: conv.visitedNodes,
    totalMessages: conv.messages.length,
  };

  // POST directly to avoid store abstraction hiding errors
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    console.error('Submission API error:', res.status, err);
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const created = await res.json();
  // Also update the local store
  useSubmissionsStore.getState().submissions.unshift(created);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Known value sets used to fix AI field-extraction mistakes ──
const KNOWN_INDUSTRY_VALUES = new Set([
  'e-commerce / d2c', 'retail', 'healthcare / pharma', 'manufacturing',
  'food & beverage', 'food and beverage', 'government', 'ecommerce',
  'e-commerce', 'd2c', 'healthcare', 'pharma', 'pharmaceutical',
]);
const KNOWN_LOCATION_VALUES = new Set([
  'dubai', 'abu dhabi', 'sharjah', 'other uae', 'outside uae',
  'within the uae', 'gcc countries', 'gcc', 'international',
  'multiple destinations', 'uae', 'ksa', 'kuwait', 'bahrain',
  'oman', 'qatar', 'europe', 'usa', 'africa', 'asia',
]);

/**
 * Sanitise AI-extracted fields so that known industry labels never land in
 * location fields and vice-versa.  Fixes the "Food & Beverage → Origin" bug.
 */
function sanitizeExtractedFields(fields: Partial<RequestFields>): Partial<RequestFields> {
  const out = { ...fields };

  // If originLocation looks like an industry, move it to businessType
  if (out.originLocation && KNOWN_INDUSTRY_VALUES.has(out.originLocation.toLowerCase())) {
    if (!out.businessType) out.businessType = out.originLocation;
    out.originLocation = null;
  }

  // If destinationLocation looks like an industry, move it
  if (out.destinationLocation && KNOWN_INDUSTRY_VALUES.has(out.destinationLocation.toLowerCase())) {
    if (!out.businessType) out.businessType = out.destinationLocation;
    out.destinationLocation = null;
  }

  // If businessType looks like a location, move it to originLocation
  if (out.businessType && KNOWN_LOCATION_VALUES.has(out.businessType.toLowerCase())) {
    if (!out.originLocation) out.originLocation = out.businessType;
    out.businessType = null;
  }

  return out;
}

/** Set of node IDs that require chip selection — free text is not allowed */
const CHIP_ONLY_NODES = new Set([
  'entity_type', 'individual_redirect',
]);

/** Validate phone: 7+ digits, not all same digit */
function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7) return false;
  if (/^(\d)\1+$/.test(digitsOnly)) return false;
  return true;
}

/** Return the first unfilled contact capture node, additional_info if not visited, or 'review' if all done */
function findNextContactNode(rs: Partial<RequestFields>): string {
  if (!rs.contactName) return 'contact_name';
  if (!rs.contactEmail) return 'contact_email';
  if (!rs.contactPhone) return 'contact_phone';
  if (!rs.companyName) return 'contact_company';
  // Always ask the additional info question before review
  const visited = useConversationStore.getState().visitedNodes;
  if (!visited.includes('additional_info')) return 'additional_info';
  return 'review';
}

const NEVER_AUTO_SKIP = new Set([
  'contact_name', 'contact_email', 'contact_phone', 'contact_company',
  'additional_info',
  'review', 'recommendation', 'recommendation_response', 'submitted',
  'entity_type', 'welcome', 'individual_redirect', 'refine_recommendation',
]);

/** Check if current_provider should be skipped for this service category */
function shouldSkipProvider(rs: Partial<RequestFields>): boolean {
  const cat = (rs.serviceCategory || '').toLowerCase();
  return cat.includes('warehouse') || cat.includes('fulfilment') || cat.includes('fulfillment') ||
         cat.includes('store') || cat.includes('customs') || cat.includes('trade') ||
         cat.includes('import') || cat.includes('postal') || cat.includes('mail');
}

/** If the target node's capturesField is already filled, follow the 'any' edge to skip it.
 *  Also skips the 'volume' node for one-time shipments. */
function resolveNodeSkip(nodeId: string, rs: Partial<RequestFields>, depth = 0): string {
  if (depth > 8 || NEVER_AUTO_SKIP.has(nodeId)) return nodeId;

  // Skip current_provider for categories where it's not relevant
  if (nodeId === 'current_provider' && shouldSkipProvider(rs)) {
    return resolveNodeSkip('contact_name', rs, depth + 1);
  }

  // One-time shipments skip the monthly volume question
  if (nodeId === 'volume') {
    const freq = (rs.frequency || '').toLowerCase();
    if (freq.includes('one-time') || freq.includes('one time')) {
      return 'origin_location';
    }
  }

  try {
    const node = getNode(nodeId);
    if (!node.capturesField) return nodeId;

    const currentValue = rs[node.capturesField as keyof RequestFields];
    const isFilled = currentValue !== null && currentValue !== undefined &&
                     currentValue !== '' && !(Array.isArray(currentValue) && currentValue.length === 0);

    if (!isFilled) return nodeId;

    // Field already captured — follow the 'any' edge to skip
    const anyEdge = node.edges?.find((e: { condition: string }) => e.condition === 'any');
    if (anyEdge) {
      return resolveNodeSkip(anyEdge.targetNodeId, rs, depth + 1);
    }
  } catch {
    // Node not found — return as-is
  }
  return nodeId;
}

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
    useRequestStore.getState().updateField('contactEmail', null);
    cs.transitionTo('contact_email');
    cs.setInputDisabled(false);
    return false;
  }

  if (rs.contactPhone && !isValidPhone(rs.contactPhone)) {
    cs.setTyping(false);
    cs.addBotMessage(
      `The phone number "${rs.contactPhone}" doesn't look valid. Please provide a valid phone number (at least 7 digits).`
    );
    useRequestStore.getState().updateField('contactPhone', null);
    cs.transitionTo('contact_phone');
    cs.setInputDisabled(false);
    return false;
  }

  // Validate contact name is a real name (letters, 2+ chars)
  if (rs.contactName && (rs.contactName.trim().length < 2 || !/[a-zA-Z\u0600-\u06FF\u0900-\u097F]/.test(rs.contactName))) {
    cs.setTyping(false);
    cs.addBotMessage('I need your real name to proceed. Could you provide your full name?');
    useRequestStore.getState().updateField('contactName', null);
    cs.transitionTo('contact_name');
    cs.setInputDisabled(false);
    return false;
  }

  // Validate company name (2+ chars)
  if (rs.companyName && rs.companyName.trim().length < 2) {
    cs.setTyping(false);
    cs.addBotMessage('Could you provide your full company name?');
    useRequestStore.getState().updateField('companyName', null);
    cs.transitionTo('contact_company');
    cs.setInputDisabled(false);
    return false;
  }

  const refNumber = generateRefNumber();
  rs.setReferenceNumber(refNumber);
  rs.setStage('submitted');
  cs.setTyping(false);

  // Persist to database first, then show success message
  try {
    await persistSubmission(refNumber);
    cs.addBotMessage(
      `Your request has been submitted successfully.\n\nReference: ${refNumber}\n\nA confirmation email has been sent to ${rs.contactEmail}. Our logistics specialists will reach out within 24 hours. Thank you for choosing 7X.`
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Submission persistence failed:', errMsg, err);
    cs.addBotMessage(
      `⚠️ There was a problem saving your request: ${errMsg}\n\nReference: ${refNumber}\n\nPlease try again or contact us directly. Your information has been noted.`
    );
  }

  cs.transitionTo('submitted');
  cs.setInputDisabled(true);

  // Clear session storage since submission is complete
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('7x-conversation');
    sessionStorage.removeItem('7x-request');
  }

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
        supplierStatus: rs.supplierStatus,
        supplierCountry: rs.supplierCountry,
        goodsCategory: rs.goodsCategory,
        incoterms: rs.incoterms,
        cargoVolume: rs.cargoVolume,
        customsRequired: rs.customsRequired,
        storageType: rs.storageType,
        recommendedServices: (rs.recommendedServices || [])
          .filter((s, i, arr) => arr.findIndex((x) => x.name === s.name) === i)
          .map((s) => ({
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
  // Import flow inference
  if (fields.serviceCategory === 'Import goods from a supplier') {
    if (!fields.supplierStatus) return 'import_supplier_known';
    if (!fields.supplierCountry) return 'import_supplier_country';
    if (!fields.goodsCategory) return 'import_goods_category';
    if (!fields.incoterms) return 'import_incoterms';
    if (!fields.cargoVolume) return 'import_cargo_volume';
    if (!fields.customsRequired) return 'import_customs';
    if (!fields.frequency) return 'import_frequency';
    // Fall through to shared node checks below
  }

  // Warehousing flow inference
  const catLower = (fields.serviceCategory || '').toLowerCase();
  const isWarehousing = catLower.includes('warehouse') || catLower.includes('fulfilment') || catLower.includes('fulfillment') || catLower.includes('store');
  if (isWarehousing) {
    if (!fields.serviceSubcategory) return 'warehouse_type';
    if (!fields.storageType) return 'warehouse_storage_type';
    if (!fields.cargoVolume) return 'warehouse_storage_volume';
    if (!fields.frequency) return 'warehouse_io_volume';
    if (!fields.businessType) return 'warehouse_business_type';
    if (!fields.originLocation) return 'origin_location';
    // Fall through to recommendation check
  }

  if (fields.contactName && fields.contactEmail && fields.contactPhone && fields.companyName) {
    const visited = useConversationStore.getState().visitedNodes;
    if (!visited.includes('additional_info')) return 'additional_info';
    return 'review';
  }
  if (fields.contactName && fields.contactEmail && fields.contactPhone) return 'contact_company';
  if (fields.contactName && fields.contactEmail) return 'contact_phone';
  if (fields.contactName) return 'contact_email';
  // Only jump to recommendation when all core fields are gathered
  const hasCoreFields =
    fields.serviceCategory && fields.serviceSubcategory &&
    fields.originLocation && fields.businessType && fields.frequency;
  if (hasCoreFields) return 'recommendation';
  if (fields.frequency) return 'business_type';
  if (fields.businessType) return 'frequency';
  if (fields.originLocation) return 'urgency';
  if (fields.specialRequirements && fields.specialRequirements.length > 0) return 'business_type';
  if (fields.urgency) return 'special_requirements';
  if (fields.destinationLocation) return 'origin_location';
  if (fields.serviceSubcategory) return 'ship_destination';
  if (fields.serviceCategory) return 'ship_destination';
  if (!fields.entityType) return 'entity_type';
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
    // Wait for Zustand persist hydration before making any decisions.
    // Even though sessionStorage is sync, Zustand processes hydration as a
    // microtask (.then()), so the store may not yet reflect persisted state.
    if (!useConversationStore.persist.hasHydrated()) {
      await new Promise<void>((resolve) => {
        const unsub = useConversationStore.persist.onFinishHydration(() => {
          unsub();
          resolve();
        });
      });
    }

    const conv = useConversationStore.getState();

    // Check if session was restored from sessionStorage
    if (conv.started && conv.messages.length > 0) {
      if (conv.isSessionExpired()) {
        conv.reset();
        useRequestStore.getState().reset();
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('7x-conversation');
          sessionStorage.removeItem('7x-request');
        }
        // Fall through to fresh start below (re-read state after reset)
      } else {
        // Session restored — show welcome back and let user continue
        conv.setTyping(false);
        conv.setInputDisabled(false);
        conv.addBotMessage('Welcome back! I\'ve restored your previous conversation. You can continue where you left off or start fresh.', [
          { id: 'continue_session', label: 'Continue' },
          { id: 'restart', label: 'Start fresh' },
        ]);
        return;
      }
    }

    // Re-read state (reset() above creates a new state object)
    const current = useConversationStore.getState();
    if (current.started) return;
    current.setStarted(true);

    current.setTyping(true);
    current.setInputDisabled(true);
    await delay(600);

    const req = useRequestStore.getState();
    const entityNode = getNode('entity_type');
    const msg = typeof entityNode.message === 'function'
      ? entityNode.message(req as RequestFields)
      : entityNode.message;

    const c = useConversationStore.getState();
    c.setTyping(false);
    c.addBotMessage(msg, entityNode.chips, entityNode.multiSelect);
    c.transitionTo('entity_type');
    c.setInputDisabled(false);
  }, []);

  const handleChipSelect = useCallback(async (chipId: string, chipLabel: string) => {
    const convStore = useConversationStore.getState();
    const reqStore = useRequestStore.getState();

    // Handle "Continue" from session restore — just enable input, no action needed
    if (chipId === 'continue_session') {
      convStore.addUserMessage(chipLabel);
      convStore.setInputDisabled(false);
      convStore.setTyping(false);
      return;
    }

    // Handle "Start fresh" from session restore — full reset & reinitialise
    if (chipId === 'restart') {
      convStore.reset();
      reqStore.reset();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('7x-conversation');
        sessionStorage.removeItem('7x-request');
      }
      // started is now false → the useEffect in ConversationPanel will
      // call startConversation() which shows the first welcome message
      return;
    }

    const currentNode = getNode(convStore.currentNodeId);
    const chip: ChipOption = { id: chipId, label: chipLabel };

    convStore.addUserMessage(chipLabel);
    convStore.setInputDisabled(true);
    convStore.setTyping(true);

    if (reqStore.stage === 'empty') {
      reqStore.setStage('gathering');
    }

    // NXN redirect — open in new tab
    if (chipId === 'go_nxn') {
      window.open('https://nxn.ae', '_blank', 'noopener,noreferrer');
      convStore.setTyping(false);
      convStore.setInputDisabled(false);
      return;
    }

    // Expert callback — redirect to /connect
    if (chipId === 'request_callback') {
      window.location.href = '/connect';
      return;
    }

    // Vague chips ("I'm not sure", "Other", etc.) — prompt freetext instead of rigid routing
    const FREETEXT_PROMPT_PAIRS = new Set([
      'welcome:unsure',
      'freight_type:not_sure',
      'ops_challenge:ops_other',
      'gcc_goods_type:others',
      'intl_goods_type:others',
      'freight_road_destination:others',
      'warehouse_business_type:other',
      'business_type:other',
      'import_supplier_country:other',
    ]);

    if (FREETEXT_PROMPT_PAIRS.has(`${convStore.currentNodeId}:${chipId}`)) {
      await delay(randomDelay());
      convStore.setTyping(false);
      convStore.addBotMessage("No problem — just tell me what you need and I'll guide you from there.");
      convStore.setInputDisabled(false);
      return;
    }

    const { nextNodeId: rawNextNodeId, fieldUpdate } = processUserInput(chip, currentNode, reqStore as RequestFields);

    if (fieldUpdate) {
      for (const [field, value] of Object.entries(fieldUpdate)) {
        useRequestStore.getState().updateField(field as keyof RequestFields, value as string | string[] | null);
      }
    }

    await delay(randomDelay());

    // Resolve skips: contact fields, volume for one-time, already-captured fields
    let nextNodeId = rawNextNodeId;
    if (['contact_name', 'contact_email', 'contact_phone', 'contact_company', 'additional_info'].includes(nextNodeId)) {
      nextNodeId = findNextContactNode(useRequestStore.getState());
    } else {
      nextNodeId = resolveNodeSkip(nextNodeId, useRequestStore.getState());
      // If skip resolved to a contact node, use findNextContactNode to find the right one
      if (['contact_name', 'contact_email', 'contact_phone', 'contact_company', 'additional_info'].includes(nextNodeId)) {
        nextNodeId = findNextContactNode(useRequestStore.getState());
      }
    }

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

    // Apply onEnter field auto-sets (e.g., import flow sets serviceCategory + destinationLocation)
    if (nextNode.onEnter) {
      const autoFields = nextNode.onEnter(useRequestStore.getState() as RequestFields);
      for (const [field, value] of Object.entries(autoFields)) {
        useRequestStore.getState().updateField(field as keyof RequestFields, value as string | string[] | null);
      }
    }

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

    // When editing from review, keep all data and let user type changes
    if (nextNodeId === 'edit_request') {
      useRequestStore.getState().setStage('gathering');
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

    // ── Bug-3 fix: block free text on chip-only nodes (entity_type, etc.) ──
    if (CHIP_ONLY_NODES.has(convStore.currentNodeId)) {
      const node = getNode(convStore.currentNodeId);
      convStore.addUserMessage(text);
      convStore.setInputDisabled(true);
      convStore.setTyping(true);
      await delay(randomDelay());
      convStore.setTyping(false);
      convStore.addBotMessage(
        'Please select one of the options above to continue.',
        node.chips,
        node.multiSelect,
      );
      convStore.setInputDisabled(false);
      return;
    }

    convStore.addUserMessage(text);
    convStore.setInputDisabled(true);
    convStore.setTyping(true);

    if (reqStore.stage === 'empty') {
      reqStore.setStage('gathering');
    }

    // Direct capture nodes — bypass AI entirely, use fixed English messages.
    // This prevents the AI from switching languages based on user's name/email.
    const DIRECT_CAPTURE_NODES = new Set([
      'contact_name', 'contact_email', 'contact_phone', 'contact_company',
      'current_provider', 'additional_info',
    ]);

    if (DIRECT_CAPTURE_NODES.has(convStore.currentNodeId)) {
      await delay(randomDelay());
      const nodeId = convStore.currentNodeId;

      // Validate input for contact fields
      if (nodeId === 'contact_email' && !EMAIL_REGEX.test(text.trim())) {
        const cs = useConversationStore.getState();
        cs.setTyping(false);
        cs.addBotMessage("That doesn't look like a valid email address. Could you provide a valid email?");
        cs.setInputDisabled(false);
        return;
      }
      if (nodeId === 'contact_phone' && !isValidPhone(text.trim())) {
        const cs = useConversationStore.getState();
        cs.setTyping(false);
        cs.addBotMessage("That doesn't look like a valid phone number. Please provide a number with at least 7 digits.");
        cs.setInputDisabled(false);
        return;
      }
      if (nodeId === 'contact_name') {
        const trimmed = text.trim();
        if (trimmed.length < 2 || !/[a-zA-Z\u0600-\u06FF\u0900-\u097F]/.test(trimmed)) {
          const cs = useConversationStore.getState();
          cs.setTyping(false);
          cs.addBotMessage('I need your full name to proceed. Could you provide it?');
          cs.setInputDisabled(false);
          return;
        }
      }
      if (nodeId === 'contact_company' && text.trim().length < 2) {
        const cs = useConversationStore.getState();
        cs.setTyping(false);
        cs.addBotMessage('Could you provide your full company name?');
        cs.setInputDisabled(false);
        return;
      }

      // Save the field
      const currentNode = getNode(nodeId);
      if (currentNode.capturesField) {
        useRequestStore.getState().updateField(currentNode.capturesField as keyof RequestFields, text.trim());
      }

      // Determine next step
      const nextNodeId = (nodeId === 'additional_info')
        ? 'review'
        : findNextContactNode(useRequestStore.getState());

      // Show next node
      if (nextNodeId === 'review') {
        useRequestStore.getState().setStage('review');
        const cs = useConversationStore.getState();
        cs.setTyping(false);
        const msgId = cs.addStreamingBotMessage();
        const prefix = nodeId === 'additional_info' ? 'Got it, thank you. ' : '';
        await typewriterStream(msgId, prefix + 'Your request is ready to submit. Please review the summary panel and submit when you\'re satisfied.');
        useConversationStore.getState().finalizeStreamingMessage(msgId, [
          { id: 'submit', label: 'Submit Request' },
          { id: 'edit', label: 'I want to change something' },
        ]);
        useConversationStore.getState().transitionTo('review');
        useConversationStore.getState().setInputDisabled(false);
      } else {
        const nextNode = getNode(nextNodeId);
        const msg = typeof nextNode.message === 'function'
          ? nextNode.message(useRequestStore.getState() as RequestFields)
          : nextNode.message;
        const cs = useConversationStore.getState();
        cs.setTyping(false);
        const msgId = cs.addStreamingBotMessage();
        await typewriterStream(msgId, msg);
        useConversationStore.getState().finalizeStreamingMessage(msgId);
        useConversationStore.getState().transitionTo(nextNodeId);
        useConversationStore.getState().setInputDisabled(false);
      }
      return;
    }

    // Build current fields snapshot
    const currentFields: Partial<RequestFields> = {
      entityType: reqStore.entityType,
      serviceCategory: reqStore.serviceCategory,
      serviceSubcategory: reqStore.serviceSubcategory,
      businessType: reqStore.businessType,
      originLocation: reqStore.originLocation,
      destinationLocation: reqStore.destinationLocation,
      frequency: reqStore.frequency,
      urgency: reqStore.urgency,
      specialRequirements: reqStore.specialRequirements,
      additionalNotes: reqStore.additionalNotes,
      currentCourier: reqStore.currentCourier,
      supplierStatus: reqStore.supplierStatus,
      supplierCountry: reqStore.supplierCountry,
      goodsCategory: reqStore.goodsCategory,
      incoterms: reqStore.incoterms,
      cargoVolume: reqStore.cargoVolume,
      customsRequired: reqStore.customsRequired,
      storageType: reqStore.storageType,
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
        // Sanitise: prevent known industry values landing in location fields etc.
        const sanitized = sanitizeExtractedFields(aiResponse.extractedFields);
        const rs = useRequestStore.getState();
        for (const [field, value] of Object.entries(sanitized)) {
          if (value !== null && value !== undefined && value !== '') {
            rs.updateField(field as keyof RequestFields, value as string | string[] | null);
          }
        }
      }

      // Validate extracted fields — clear invalid ones so AI naturally re-asks
      const FAKE_DATA_RE = /^(test|xxx|asdf|abc|fake|na|n\/a|none|aaa|qwerty|sample)$/i;

      if (aiResponse.extractedFields?.contactEmail) {
        const email = aiResponse.extractedFields.contactEmail as string;
        if (!EMAIL_REGEX.test(email)) {
          useRequestStore.getState().updateField('contactEmail', null);
        }
      }
      if (aiResponse.extractedFields?.contactPhone) {
        const phone = aiResponse.extractedFields.contactPhone as string;
        if (!isValidPhone(phone)) {
          useRequestStore.getState().updateField('contactPhone', null);
        }
      }
      if (aiResponse.extractedFields?.contactName) {
        const name = (aiResponse.extractedFields.contactName as string).trim();
        if (name.length < 2 || !/[a-zA-Z\u0600-\u06FF\u0900-\u097F]/.test(name) || FAKE_DATA_RE.test(name)) {
          useRequestStore.getState().updateField('contactName', null);
        }
      }
      if (aiResponse.extractedFields?.companyName) {
        const company = (aiResponse.extractedFields.companyName as string).trim();
        if (company.length < 2 || FAKE_DATA_RE.test(company)) {
          useRequestStore.getState().updateField('companyName', null);
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
      const catLwr = (rs.serviceCategory || '').toLowerCase();
      const isWhOrCustomsOrPostal = catLwr.includes('warehouse') || catLwr.includes('fulfilment') || catLwr.includes('fulfillment') || catLwr.includes('store') || catLwr.includes('customs') || catLwr.includes('trade') || catLwr.includes('postal') || catLwr.includes('mail');
      const hasEnoughForRecs =
        !!rs.serviceCategory &&
        !!rs.originLocation &&
        (isWhOrCustomsOrPostal || !!rs.destinationLocation) &&
        (isWhOrCustomsOrPostal || !!rs.urgency) &&
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
        // All contact fields captured — check if we still need additional_info
        const rs2 = useRequestStore.getState();
        const nextContactNode = findNextContactNode(rs2);

        if (nextContactNode === 'review') {
          // Everything captured — go to review
          useRequestStore.getState().setStage('review');
          await typewriterStream(msgId, 'Your request is ready to submit. Please review the summary panel and submit when you\'re satisfied.');
          useConversationStore.getState().finalizeStreamingMessage(msgId, [
            { id: 'submit', label: 'Submit Request' },
            { id: 'edit', label: 'I want to change something' },
          ]);
          const cs2 = useConversationStore.getState();
          cs2.transitionTo('review');
          cs2.setInputDisabled(false);
        } else {
          // Still need contact fields or additional_info
          const contactNode = getNode(nextContactNode);
          const contactMsg = typeof contactNode.message === 'function'
            ? contactNode.message(rs2 as RequestFields)
            : contactNode.message;
          await typewriterStream(msgId, aiResponse.message + '\n\n' + contactMsg);
          useConversationStore.getState().finalizeStreamingMessage(msgId);
          useConversationStore.getState().transitionTo(nextContactNode);
          useConversationStore.getState().setInputDisabled(false);
        }
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

      const { nextNodeId: rawFallbackId, fieldUpdate } = processUserInput(text, currentNode, reqStore as RequestFields);

      if (fieldUpdate) {
        for (const [field, value] of Object.entries(fieldUpdate)) {
          useRequestStore.getState().updateField(field as keyof RequestFields, value as string | string[] | null);
        }
      }

      // Apply field-skip and contact-skip logic
      let nextNodeId = rawFallbackId;
      if (['contact_name', 'contact_email', 'contact_phone', 'contact_company', 'additional_info'].includes(nextNodeId)) {
        nextNodeId = findNextContactNode(useRequestStore.getState());
      } else {
        nextNodeId = resolveNodeSkip(nextNodeId, useRequestStore.getState());
        // If skip resolved to a contact node, use findNextContactNode
        if (['contact_name', 'contact_email', 'contact_phone', 'contact_company', 'additional_info'].includes(nextNodeId)) {
          nextNodeId = findNextContactNode(useRequestStore.getState());
        }
      }

      if (nextNodeId === 'submitted') {
        await handleSubmission();
        return;
      }

      const nextNode = getNode(nextNodeId);

      // Apply onEnter field auto-sets in fallback path too
      if (nextNode.onEnter) {
        const autoFields = nextNode.onEnter(useRequestStore.getState() as RequestFields);
        for (const [field, value] of Object.entries(autoFields)) {
          useRequestStore.getState().updateField(field as keyof RequestFields, value as string | string[] | null);
        }
      }

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

    const anyEdge = currentNode.edges.find((e: { condition: string }) => e.condition === 'any');
    const rawNextId = anyEdge?.targetNodeId || 'business_type';
    const nextNodeId = resolveNodeSkip(rawNextId, useRequestStore.getState());
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

    // Deduplicate services by name before storing
    const uniqueServices = selectedServices.filter(
      (s, i, arr) => arr.findIndex((x) => x.name === s.name) === i,
    );

    // Store selected services
    rs.setRecommendedServices(uniqueServices);

    // Show what user selected
    cs.addUserMessage(
      `Selected: ${uniqueServices.map((s) => s.name).join(', ')}`
    );
    cs.setInputDisabled(true);
    cs.setTyping(true);

    await delay(randomDelay());

    // Check if we should ask about current provider first
    const rsNow = useRequestStore.getState();
    const askProvider = !rsNow.currentCourier && !shouldSkipProvider(rsNow);

    // Determine first step: provider question or contact capture
    const firstStepNodeId = askProvider ? 'current_provider' : findNextContactNode(rsNow);

    if (firstStepNodeId === 'review') {
      // All contact fields + additional info captured — go straight to review
      useRequestStore.getState().setStage('review');
      const cs2 = useConversationStore.getState();
      cs2.setTyping(false);
      const followId = cs2.addStreamingBotMessage();
      await typewriterStream(followId, "Great choices. Your request is ready to submit. Please review the summary panel and submit when you're satisfied.");
      useConversationStore.getState().finalizeStreamingMessage(followId, [
        { id: 'submit', label: 'Submit Request' },
        { id: 'edit', label: 'I want to change something' },
      ]);
      useConversationStore.getState().transitionTo('review');
      useConversationStore.getState().setInputDisabled(false);
    } else {
      const stepNode = getNode(firstStepNodeId);
      const stepMsg = typeof stepNode.message === 'function'
        ? stepNode.message(useRequestStore.getState() as RequestFields)
        : stepNode.message;

      const cs2 = useConversationStore.getState();
      cs2.setTyping(false);
      const followId = cs2.addStreamingBotMessage();
      // Use appropriate prefix based on whether we're entering contact/provider capture or additional info
      const prefix = ['contact_name', 'contact_email', 'contact_phone', 'contact_company', 'current_provider'].includes(firstStepNodeId)
        ? "Great choices. Just a few details to finalize your request.\n\n"
        : "Great choices.\n\n";
      await typewriterStream(followId, prefix + stepMsg);
      useConversationStore.getState().finalizeStreamingMessage(followId);
      useConversationStore.getState().transitionTo(firstStepNodeId);
      useConversationStore.getState().setInputDisabled(false);
    }
  }, []);

  return {
    startConversation,
    handleChipSelect,
    handleTextSubmit,
    handleMultiSelect,
    handleServiceConfirm,
  };
}
