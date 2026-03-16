export interface VesselInfo {
  id: string;
  name: string;
  type: string;
  flag: string;
  status: string;
  speed: number | null;
  lat: number | null;
  lng: number | null;
  destination: string | null;
  lastUpdate: string | null;
}

export interface FlightInfo {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    iata: string;
    scheduled: string | null;
    actual: string | null;
  };
  arrival: {
    airport: string;
    city: string;
    iata: string;
    scheduled: string | null;
    actual: string | null;
  };
  status: string;
  aircraft: string | null;
}

export interface PulseNewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description: string | null;
  imageUrl: string | null;
}

export interface PulseSectionState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export interface PulseData {
  maritime: VesselInfo[];
  aviation: FlightInfo[];
  news: PulseNewsItem[];
}

// --- Control Tower Event Types ---

export type PulseEventType = 'disruption' | 'flight' | 'vessel' | 'news';
export type PulseSeverity = 'critical' | 'warning' | 'info' | 'neutral';
export type PulseFilter = 'all' | 'disruptions' | 'flights' | 'maritime' | 'news';

export interface PulseEvent {
  id: string;
  type: PulseEventType;
  severity: PulseSeverity;
  title: string;
  description: string;
  timestamp: number;
  timeLabel: string;
  source: string;
  category: string;
  meta?: Record<string, string>;
  url?: string;
}
