import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt } from '@/engine/ai';
import type { RequestFields } from '@/engine/types';

// Simple in-memory rate limiter (per IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // max requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Allowed field keys that the AI can extract
const ALLOWED_FIELDS = new Set<string>([
  'serviceCategory', 'serviceSubcategory', 'businessType',
  'originLocation', 'destinationLocation', 'frequency',
  'urgency', 'specialRequirements', 'additionalNotes',
  'contactName', 'contactEmail', 'contactPhone', 'companyName',
  'supplierStatus', 'supplierCountry', 'goodsCategory',
  'incoterms', 'cargoVolume', 'customsRequired',
  'storageType',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 40;

function getEnv(key: string): string | undefined {
  return process.env[key] || undefined;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a JSON object' },
        { status: 400 }
      );
    }

    const { messages, currentFields } = body as {
      messages?: unknown;
      currentFields?: unknown;
    };

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages must be a non-empty array' },
        { status: 400 }
      );
    }

    // Truncate to last N messages and validate each
    const recentMessages = messages.slice(-MAX_MESSAGES);
    for (const msg of recentMessages) {
      if (!msg || typeof msg !== 'object' || !('role' in msg) || !('content' in msg)) {
        return NextResponse.json(
          { error: 'Each message must have role and content properties' },
          { status: 400 }
        );
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json(
          { error: 'Message role must be "user" or "assistant"' },
          { status: 400 }
        );
      }
      if (typeof msg.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json(
          { error: `Each message content must be a string under ${MAX_MESSAGE_LENGTH} characters` },
          { status: 400 }
        );
      }
    }

    // Validate currentFields is an object (or missing)
    const fields = (currentFields && typeof currentFields === 'object' ? currentFields : {}) as Partial<RequestFields>;

    // Load Azure AI Foundry credentials (Anthropic Claude endpoint)
    const endpoint = getEnv('AZURE_AI_ENDPOINT');
    const apiKey = getEnv('AZURE_AI_KEY');
    const model = getEnv('AZURE_AI_DEPLOYMENT') || 'idealabFoundry';

    if (!endpoint || !apiKey) {
      return NextResponse.json(
        { error: 'Azure AI credentials not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(fields);

    // Build Anthropic Messages API payload
    const anthropicMessages = recentMessages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Call Azure AI Foundry — Anthropic Messages API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let aiResponse;
    try {
      aiResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          system: systemPrompt,
          messages: anthropicMessages,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      console.error('Claude API error:', aiResponse.status, errorBody);

      if (aiResponse.status === 429) {
        return NextResponse.json(
          { error: 'AI service is busy. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
      if (aiResponse.status === 503) {
        return NextResponse.json(
          { error: 'AI service is temporarily unavailable. Please try again shortly.' },
          { status: 503 }
        );
      }
      if (aiResponse.status === 401) {
        return NextResponse.json(
          { error: 'AI service authentication failed.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
        { status: 500 }
      );
    }

    const aiData = await aiResponse.json();

    // Extract text from Anthropic response format
    // Response: { content: [{ type: "text", text: "..." }], ... }
    const textContent = aiData.content
      ?.filter((block: { type: string }) => block.type === 'text')
      ?.map((block: { text: string }) => block.text)
      ?.join('');

    if (!textContent) {
      return NextResponse.json(
        { error: 'No text response from AI' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let parsed;
    try {
      let jsonStr = textContent.trim();

      // Strip markdown code blocks if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      // Try to find JSON boundaries if there's preamble text
      if (!jsonStr.startsWith('{')) {
        const start = jsonStr.indexOf('{');
        const end = jsonStr.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          jsonStr = jsonStr.slice(start, end + 1);
        }
      }

      parsed = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, return the raw text as a message with no extractions
      parsed = {
        message: textContent,
        extractedFields: {},
        suggestedOptions: [],
        confidence: 0.5,
        shouldShowRecommendations: false,
        allFieldsComplete: false,
      };
    }

    // Sanitize extracted fields — only allow whitelisted keys
    if (parsed.extractedFields && typeof parsed.extractedFields === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(parsed.extractedFields)) {
        if (ALLOWED_FIELDS.has(key) && value !== null && value !== undefined) {
          // Validate email format
          if (key === 'contactEmail' && typeof value === 'string' && !EMAIL_REGEX.test(value)) {
            continue; // skip invalid email
          }
          sanitized[key] = value;
        }
      }
      parsed.extractedFields = sanitized;
    }

    // Sanitize recommendedServiceIds — must be an array of strings
    if (parsed.recommendedServiceIds) {
      if (!Array.isArray(parsed.recommendedServiceIds)) {
        parsed.recommendedServiceIds = [];
      } else {
        parsed.recommendedServiceIds = parsed.recommendedServiceIds.filter(
          (id: unknown) => typeof id === 'string' && id.length > 0
        );
      }
    }

    // Ensure message is a string
    if (typeof parsed.message !== 'string' || parsed.message.trim() === '') {
      parsed.message = "I'm here to help with your logistics needs. Could you tell me more about what you're looking for?";
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error('Chat API error:', error);

    // AbortController timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
