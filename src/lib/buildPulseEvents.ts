import { timeAgo } from '@/lib/formatters';
import type {
  VesselInfo,
  FlightInfo,
  PulseNewsItem,
  PulseEvent,
  PulseSeverity,
} from '@/lib/pulse-types';

const DISRUPTION_KEYWORDS = [
  'delay', 'delayed', 'disruption', 'strike', 'shortage', 'crisis',
  'war', 'chaos', 'congestion', 'suspend', 'cancel', 'halt', 'block',
  'sanctions', 'storm', 'flood', 'closure', 'divert', 'grounded',
  'embargo', 'threat', 'attack', 'inflation', 'surge', 'spike',
];

function hasDisruptionKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return DISRUPTION_KEYWORDS.some((kw) => lower.includes(kw));
}

function formatFlightTime(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Dubai',
    });
  } catch {
    return '';
  }
}

function flightToEvent(flight: FlightInfo): PulseEvent {
  const status = flight.status.toLowerCase();
  const isDisrupted = ['cancelled', 'diverted', 'incident'].includes(status);
  const isDelayed = status === 'delayed';
  const isActive = status === 'active';

  let severity: PulseSeverity = 'neutral';
  if (isDisrupted) severity = 'critical';
  else if (isDelayed) severity = 'warning';
  else if (isActive) severity = 'info';

  const depTime = formatFlightTime(flight.departure.scheduled || flight.departure.actual);
  const route = `${flight.departure.iata} → ${flight.arrival.iata}`;

  let description = `${flight.airline} departure to ${flight.arrival.city || flight.arrival.iata}`;
  if (depTime) description += `, scheduled ${depTime} GST`;
  if (isDelayed) description = `${flight.airline} flight to ${flight.arrival.city || flight.arrival.iata} — delayed`;
  if (isDisrupted) description = `${flight.airline} flight to ${flight.arrival.city || flight.arrival.iata} — ${flight.status}`;

  const timestamp = flight.departure.scheduled
    ? new Date(flight.departure.scheduled).getTime()
    : Date.now();

  const meta: Record<string, string> = {
    route,
    status: flight.status.charAt(0).toUpperCase() + flight.status.slice(1),
    airline: flight.airline,
  };
  if (depTime) meta.departure = depTime + ' GST';

  return {
    id: `flight-${flight.id}`,
    type: isDisrupted || isDelayed ? 'disruption' : 'flight',
    severity,
    title: `${flight.flightNumber} · ${route}`,
    description,
    timestamp,
    timeLabel: timeAgo(timestamp),
    source: 'AviationStack',
    category: 'Aviation',
    meta,
  };
}

function vesselToEvent(vessel: VesselInfo): PulseEvent {
  const status = vessel.status.toLowerCase();
  const isAnchored = status.includes('anchor') || status.includes('moored');
  const isUnderway = status.includes('under way') || status.includes('sailing');

  let severity: PulseSeverity = 'neutral';
  if (isAnchored) severity = 'warning';
  else if (isUnderway) severity = 'info';

  let statusLabel = 'Unknown';
  if (isUnderway) statusLabel = 'Underway';
  else if (isAnchored) statusLabel = 'Anchored';
  else if (status && status !== 'unknown') statusLabel = vessel.status;

  let description = `${vessel.type} vessel`;
  if (vessel.destination) description += ` heading to ${vessel.destination}`;
  if (vessel.speed && vessel.speed > 0) description += ` at ${vessel.speed} kn`;
  if (isAnchored && vessel.destination) description = `${vessel.type} vessel anchored near ${vessel.destination}`;
  if (isAnchored && !vessel.destination) description = `${vessel.type} vessel at anchor — possible port congestion`;

  const timestamp = vessel.lastUpdate
    ? new Date(vessel.lastUpdate).getTime()
    : Date.now();

  const meta: Record<string, string> = {
    status: statusLabel,
    type: vessel.type,
  };
  if (vessel.flag && vessel.flag !== '—') meta.flag = vessel.flag;
  if (vessel.speed && vessel.speed > 0) meta.speed = `${vessel.speed} kn`;
  if (vessel.destination) meta.destination = vessel.destination;

  return {
    id: `vessel-${vessel.id}`,
    type: 'vessel',
    severity,
    title: `${vessel.name} · ${statusLabel}`,
    description,
    timestamp,
    timeLabel: timeAgo(timestamp),
    source: 'Datalastic',
    category: 'Maritime',
    meta,
  };
}

function newsToEvent(article: PulseNewsItem): PulseEvent {
  const isDisruption = hasDisruptionKeyword(article.title) ||
    (article.description ? hasDisruptionKeyword(article.description) : false);

  const severity: PulseSeverity = isDisruption ? 'warning' : 'info';
  const timestamp = new Date(article.publishedAt).getTime();

  const meta: Record<string, string> = {
    source: article.source,
  };

  return {
    id: `news-${article.id}`,
    type: isDisruption ? 'disruption' : 'news',
    severity,
    title: article.title,
    description: article.description || '',
    timestamp,
    timeLabel: timeAgo(timestamp),
    source: 'NewsAPI',
    category: 'Industry News',
    meta,
    url: article.url,
  };
}

export function buildPulseEvents(
  vessels: VesselInfo[],
  flights: FlightInfo[],
  news: PulseNewsItem[]
): PulseEvent[] {
  const events: PulseEvent[] = [
    ...flights.map(flightToEvent),
    ...vessels.map(vesselToEvent),
    ...news.map(newsToEvent),
  ];

  // Sort newest first
  events.sort((a, b) => b.timestamp - a.timestamp);

  return events;
}
