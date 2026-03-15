import type { RequestFields, ServiceMatch } from './types';
import { SERVICE_CATALOG, CATEGORY_LABELS } from './catalog';

// ============================================================
// AI CONVERSATION ENGINE — System prompt & field extraction
// ============================================================

const SERVICE_SUMMARY = SERVICE_CATALOG.map(
  (s) =>
    `- ${s.name} (${CATEGORY_LABELS[s.category] || s.category}): ${s.description} [verticals: ${s.verticals.join(', ')}; capabilities: ${s.specialCapabilities.join(', ') || 'none'}; urgency: ${s.urgencyLevels.join(', ')}; regions: ${s.regions.join(', ')}]`
).join('\n');

export function buildSystemPrompt(currentFields: Partial<RequestFields>): string {
  const filledFields = Object.entries(currentFields)
    .filter(([, v]) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');

  const missingFields = Object.entries(currentFields)
    .filter(([, v]) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0))
    .map(([k]) => k);

  return `You are 7X Assistant, a smart logistics solutions advisor for 7X — a leading logistics platform in the UAE and GCC region.

Your role is to have a natural conversation with users to understand their logistics needs and help them find the right service. You extract structured information from their messages to populate a service request form.

## YOUR BEHAVIOR
- Be conversational, warm, and professional. Keep responses concise (1-3 sentences max).
- Extract as much information as possible from each message — users may provide multiple details at once.
- After extracting information, ask about the MOST IMPORTANT missing field next.
- Never repeat information the user already provided.
- If the user's message is ambiguous, make reasonable inferences based on context.
- Always acknowledge what you understood before asking the next question.
- If the user asks something off-topic, gently redirect to their logistics needs.
- Do NOT use emojis. Be professional but friendly.

## FIELDS TO CAPTURE
These are the fields you need to fill. Extract them from natural language:

1. **serviceCategory** — What type of service: shipping/parcels, freight, warehousing, fulfillment, returns, customs, postal
2. **serviceSubcategory** — Specific sub-type (e.g., "air freight", "cold storage", "pick & pack", "same day delivery")
3. **businessType** — User's industry (e-commerce, retail, healthcare, manufacturing, food & beverage, government, etc.)
4. **originLocation** — Where they're based or shipping from (Dubai, Abu Dhabi, Sharjah, other UAE, outside UAE)
5. **destinationLocation** — Where shipments go (domestic UAE, GCC, international, multiple)
6. **frequency** — Volume/frequency (under 100, 100-1000, 1000-10000, 10000+ shipments/month, or storage duration)
7. **urgency** — How urgent (immediate, this week, planning ahead, exploring)
8. **specialRequirements** — Array of: temperature sensitive, high value, dangerous goods, fragile, oversized (or empty)
9. **additionalNotes** — Any extra context
10. **contactName** — User's full name
11. **contactEmail** — Email address
12. **companyName** — Company name

## CURRENTLY CAPTURED
${filledFields || '  (nothing yet)'}

## STILL MISSING
${missingFields.join(', ')}

## AVAILABLE SERVICES
${SERVICE_SUMMARY}

## RESPONSE FORMAT
You MUST respond with valid JSON only. No markdown, no code blocks, just raw JSON:
{
  "message": "Your conversational response to the user",
  "extractedFields": {
    // Only include fields you can extract from THIS message
    // Use null for fields you cannot determine
    // For specialRequirements, use an array of strings
  },
  "suggestedOptions": [
    // 2-5 quick-reply options relevant to your question (optional)
    // Each: { "id": "unique_id", "label": "Short label" }
  ],
  "confidence": 0.0-1.0,
  "shouldShowRecommendations": false,
  "allFieldsComplete": false
}

## LOGIC
- Set "shouldShowRecommendations" to true when you have serviceCategory + at least 2 of: serviceSubcategory, businessType, urgency, originLocation
- Set "allFieldsComplete" to true only when contactName, contactEmail, AND companyName are all captured
- For "confidence", estimate how confident you are in your field extractions (0.0-1.0)
- Always provide "suggestedOptions" for the next question — these become clickable chips
- Prioritize capturing fields in this order: serviceCategory -> serviceSubcategory -> destinationLocation -> urgency -> specialRequirements -> businessType -> frequency -> originLocation -> contactName -> contactEmail -> companyName

## EXTRACTION RULES
- "I need to ship 500 packages to Saudi Arabia monthly" -> serviceCategory: "Ship packages or parcels", destinationLocation: "GCC countries", frequency: "100 - 1,000"
- "We're an e-commerce company in Dubai" -> businessType: "E-commerce / D2C", originLocation: "Dubai"
- "It's urgent, need cold chain" -> urgency: "Immediate / ASAP", specialRequirements: ["Temperature sensitive"]
- "I'm John from Acme Corp, john@acme.com" -> contactName: "John", companyName: "Acme Corp", contactEmail: "john@acme.com"
- Use the exact label values from the chip options in the conversation nodes when possible for consistency.`;
}

export interface AIResponse {
  message: string;
  extractedFields: Partial<RequestFields>;
  suggestedOptions?: Array<{ id: string; label: string }>;
  confidence: number;
  shouldShowRecommendations: boolean;
  allFieldsComplete: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function buildChatMessages(
  conversationHistory: Array<{ role: 'bot' | 'user'; content: string }>,
): ChatMessage[] {
  return conversationHistory
    .filter((m) => m.content.trim() !== '')
    .map((m) => ({
      role: m.role === 'bot' ? 'assistant' as const : 'user' as const,
      content: m.content,
    }));
}

// Quick-score services based on extracted fields (client-side fallback)
export function scoreServicesFromFields(fields: Partial<RequestFields>): ServiceMatch[] {
  const scored = SERVICE_CATALOG.map((service) => {
    let score = 0;
    const cat = fields.serviceCategory?.toLowerCase() || '';
    const sub = fields.serviceSubcategory?.toLowerCase() || '';

    // Category matching
    if (cat) {
      if (cat.includes('ship') || cat.includes('parcel') || cat.includes('courier')) {
        if (service.category === 'domestic_courier' || service.category === 'international') score += 40;
      }
      if (cat.includes('freight') || cat.includes('cargo')) {
        if (service.category === 'freight' || service.category === 'road_freight') score += 40;
      }
      if (cat.includes('warehouse') || cat.includes('storage') || cat.includes('store')) {
        if (service.category === 'warehousing') score += 40;
      }
      if (cat.includes('fulfil')) {
        if (service.category === 'fulfillment') score += 40;
      }
      if (cat.includes('return') || cat.includes('reverse')) {
        if (service.category === 'reverse_logistics') score += 40;
      }
      if (cat.includes('customs') || cat.includes('trade')) {
        if (service.category === 'trade_customs') score += 40;
      }
      if (cat.includes('postal') || cat.includes('mail')) {
        if (service.category === 'postal') score += 40;
      }
    }

    // Subcategory boost
    if (sub && (service.subcategory.includes(sub) || service.name.toLowerCase().includes(sub))) {
      score += 15;
    }

    // Business type / vertical match
    if (fields.businessType) {
      const bt = fields.businessType.toLowerCase();
      if (bt.includes('e-commerce') || bt.includes('ecommerce')) {
        if (service.verticals.includes('ecommerce')) score += 15;
      }
      if (bt.includes('food') || bt.includes('beverage')) {
        if (service.verticals.includes('food')) score += 15;
      }
      if (bt.includes('pharma') || bt.includes('health')) {
        if (service.verticals.includes('pharma')) score += 15;
      }
    }

    // Special requirements
    const specials = fields.specialRequirements || [];
    for (const req of specials) {
      const lower = req.toLowerCase();
      if (lower.includes('temperature') && service.specialCapabilities.includes('temperature_controlled')) score += 10;
      if (lower.includes('dangerous') && service.specialCapabilities.includes('dangerous_goods')) score += 10;
      if (lower.includes('high value') && service.specialCapabilities.includes('high_value')) score += 10;
    }

    // Urgency
    if (fields.urgency) {
      const u = fields.urgency.toLowerCase();
      if (u.includes('same day') && service.urgencyLevels.includes('same_day')) score += 10;
      if (u.includes('next day') && service.urgencyLevels.includes('next_day')) score += 10;
      if (u.includes('express') && service.urgencyLevels.includes('express')) score += 10;
    }

    return { service, score: Math.min(score, 100) };
  });

  return scored
    .filter(({ score }) => score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ service, score }) => ({
      id: service.id,
      name: service.name,
      category: CATEGORY_LABELS[service.category] || service.category,
      confidence: score,
      description: service.description,
      vertical: service.verticals[0] || '',
    }));
}
