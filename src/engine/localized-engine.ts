// Engine localization wrapper — overlays translated strings onto engine nodes
import { getNode } from './engine';
import { getCurrentLocale } from '@/i18n/config';
import type { ConversationNode } from './types';
import type { EngineNodeStrings } from '@/i18n/engine-en';
import engineEn from '@/i18n/engine-en';
import engineAr from '@/i18n/engine-ar';

const engineDicts: Record<string, Record<string, EngineNodeStrings>> = { en: engineEn, ar: engineAr };

/**
 * Return a ConversationNode with message, chip labels, and freeTextPlaceholder
 * translated to the current locale. Structure, edges, and logic stay untouched.
 */
export function getLocalizedNode(nodeId: string): ConversationNode {
  const node = getNode(nodeId);
  const locale = getCurrentLocale();
  const strings = engineDicts[locale]?.[nodeId];

  if (!strings) return node;

  const localized = { ...node };

  // Overlay message
  if (strings.message !== undefined) {
    localized.message = strings.message;
  }

  // Overlay chip labels (keep id, icon, description from original)
  if (strings.chips && node.chips) {
    localized.chips = node.chips.map((chip) => ({
      ...chip,
      label: strings.chips![chip.id] ?? chip.label,
    }));
  }

  // Overlay freeTextPlaceholder
  if (strings.freeTextPlaceholder) {
    localized.freeTextPlaceholder = strings.freeTextPlaceholder;
  }

  return localized;
}
