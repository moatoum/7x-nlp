import { SERVICE_CATALOG, CATEGORY_LABELS } from './catalog';
import type { RequestFields, ServiceMatch } from './types';

const CATEGORY_MAP: Record<string, string> = {
  'Ship packages or parcels': 'domestic_courier',
  'Domestic delivery': 'domestic_courier',
  'International shipping': 'international',
  'Move large cargo or freight': 'freight',
  'Store or warehouse goods': 'warehousing',
  'Fulfill online orders': 'fulfillment',
  'Handle returns or repairs': 'reverse_logistics',
  'Customs and trade services': 'trade_customs',
  'Postal and mail services': 'postal',
  'First Mile / Pickup': 'first_mile',
  'Last Mile / Delivery': 'last_mile',
  'Road freight / Trucking': 'road_freight',
};

function normalizeCategory(input: string | null): string | null {
  if (!input) return null;
  return CATEGORY_MAP[input] || input;
}

function normalizeUrgency(input: string | null): string[] {
  if (!input) return [];
  const lower = input.toLowerCase();
  if (lower.includes('same day') || lower.includes('urgent')) return ['same_day'];
  if (lower.includes('next day')) return ['next_day'];
  if (lower.includes('express') || lower.includes('fast')) return ['express'];
  return ['standard'];
}

function normalizeRegion(input: string | null): string[] {
  if (!input) return [];
  const lower = input.toLowerCase();
  if (lower.includes('international') || lower.includes('worldwide') || lower.includes('global')) return ['international'];
  if (lower.includes('gcc') || lower.includes('regional')) return ['gcc'];
  if (lower.includes('domestic') || lower.includes('uae') || lower.includes('local')) return ['domestic'];
  return [];
}

function normalizeVertical(input: string | null): string[] {
  if (!input) return [];
  const lower = input.toLowerCase();
  const map: Record<string, string[]> = {
    'e-commerce': ['ecommerce', 'quick_commerce'],
    'retail': ['retail', 'omnichannel_retail'],
    'healthcare': ['healthcare', 'pharma'],
    'manufacturing': ['manufacturing', 'industrial'],
    'food': ['food', 'grocery'],
    'government': ['government'],
    'chemicals': ['chemicals'],
    'luxury': ['luxury'],
    'automotive': ['automotive'],
    'construction': ['construction'],
  };
  for (const [key, values] of Object.entries(map)) {
    if (lower.includes(key)) return values;
  }
  return [];
}

function normalizeSpecial(requirements: string[]): string[] {
  const result: string[] = [];
  for (const req of requirements) {
    const lower = req.toLowerCase();
    if (lower.includes('temperature') || lower.includes('cold') || lower.includes('chilled')) result.push('temperature_controlled');
    if (lower.includes('high value') || lower.includes('valuable')) result.push('high_value');
    if (lower.includes('dangerous') || lower.includes('hazardous')) result.push('dangerous_goods');
    if (lower.includes('oversized') || lower.includes('heavy') || lower.includes('bulky')) result.push('oversized');
    if (lower.includes('identity') || lower.includes('verification')) result.push('identity_verified');
    if (lower.includes('bonded')) result.push('bonded');
  }
  return result;
}

export function matchServices(request: RequestFields): ServiceMatch[] {
  const categoryKey = normalizeCategory(request.serviceCategory);
  const urgencies = normalizeUrgency(request.urgency);
  const regions = normalizeRegion(request.originLocation || request.destinationLocation);
  const verticals = normalizeVertical(request.businessType);
  const specials = normalizeSpecial(request.specialRequirements);

  const scored = SERVICE_CATALOG.map((service) => {
    let score = 0;

    // Category match: 40 pts
    if (categoryKey && service.category === categoryKey) score += 40;

    // Subcategory boost: 15 pts
    if (request.serviceSubcategory) {
      const subLower = request.serviceSubcategory.toLowerCase();
      if (service.subcategory.includes(subLower) || service.name.toLowerCase().includes(subLower)) score += 15;
    }

    // Vertical match: 15 pts
    if (verticals.length > 0) {
      const overlap = verticals.filter((v) => service.verticals.includes(v));
      if (overlap.length > 0) score += 15;
    }

    // Special requirements: 15 pts
    if (specials.length > 0) {
      const overlap = specials.filter((s) => service.specialCapabilities.includes(s));
      score += Math.round((overlap.length / specials.length) * 15);
    }

    // Urgency match: 10 pts
    if (urgencies.length > 0) {
      const overlap = urgencies.filter((u) => service.urgencyLevels.includes(u));
      if (overlap.length > 0) score += 10;
    }

    // Region match: 5 pts
    if (regions.length > 0) {
      const overlap = regions.filter((r) => service.regions.includes(r));
      if (overlap.length > 0) score += 5;
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
