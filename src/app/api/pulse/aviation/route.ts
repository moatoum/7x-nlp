import { NextResponse } from 'next/server';
import type { FlightInfo } from '@/lib/pulse-types';

export const dynamic = 'force-dynamic';

// In-memory cache (5 min TTL) — critical for free tier (100 req/month)
let cache: { data: FlightInfo[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

const ACCESS_KEY = process.env.AVIATIONSTACK_ACCESS_KEY || '';

export async function GET() {
  try {
    // Return cached data if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(
        { flights: cache.data },
        { headers: { 'Cache-Control': 'public, s-maxage=300' } }
      );
    }

    const url = `https://api.aviationstack.com/v1/flights?access_key=${ACCESS_KEY}&dep_iata=DXB&limit=10`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });

    if (!res.ok) {
      throw new Error(`AviationStack API returned ${res.status}`);
    }

    const json = await res.json();

    if (json.error) {
      throw new Error(json.error.message || 'AviationStack API error');
    }

    const rawFlights = json.data || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flights: FlightInfo[] = rawFlights.map((f: any, i: number) => ({
      id: `${f.flight?.iata || 'FL'}-${i}`,
      airline: f.airline?.name || 'Unknown Airline',
      flightNumber: f.flight?.iata || f.flight?.icao || `FL${i}`,
      departure: {
        airport: f.departure?.airport || 'Dubai International',
        city: f.departure?.timezone?.split('/')?.pop()?.replace('_', ' ') || 'Dubai',
        iata: f.departure?.iata || 'DXB',
        scheduled: f.departure?.scheduled || null,
        actual: f.departure?.actual || null,
      },
      arrival: {
        airport: f.arrival?.airport || 'Unknown',
        city: f.arrival?.timezone?.split('/')?.pop()?.replace('_', ' ') || 'Unknown',
        iata: f.arrival?.iata || '—',
        scheduled: f.arrival?.scheduled || null,
        actual: f.arrival?.actual || null,
      },
      status: f.flight_status || 'scheduled',
      aircraft: f.aircraft?.registration || null,
    }));

    // Update cache
    cache = { data: flights, timestamp: Date.now() };

    return NextResponse.json(
      { flights },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    );
  } catch (error) {
    console.error('Aviation API error:', error);
    return NextResponse.json(
      { flights: [], error: 'Failed to fetch aviation data' },
      { status: 200 }
    );
  }
}
