import { NextResponse } from 'next/server';
import type { VesselInfo } from '@/lib/pulse-types';

export const dynamic = 'force-dynamic';

// In-memory cache (5 min TTL)
let cache: { data: VesselInfo[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

const API_KEY = 'efddf545-daa6-4b87-a6e3-84f450fe6f7c';

export async function GET() {
  try {
    // Return cached data if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(
        { vessels: cache.data },
        { headers: { 'Cache-Control': 'public, s-maxage=300' } }
      );
    }

    // Try UAE keyword first, fallback to cargo
    let vessels = await fetchVessels('UAE');
    if (vessels.length === 0) {
      vessels = await fetchVessels('cargo');
    }

    // Update cache
    cache = { data: vessels, timestamp: Date.now() };

    return NextResponse.json(
      { vessels },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    );
  } catch (error) {
    console.error('Maritime API error:', error);
    return NextResponse.json(
      { vessels: [], error: 'Failed to fetch maritime data' },
      { status: 200 }
    );
  }
}

async function fetchVessels(keyword: string): Promise<VesselInfo[]> {
  const url = `https://api.datalastic.com/api/v0/vessel?api-key=${API_KEY}&keyword=${keyword}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    throw new Error(`Datalastic API returned ${res.status}`);
  }

  const json = await res.json();
  const rawVessels = json.data || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawVessels.slice(0, 8).map((v: any, i: number) => ({
    id: v.uuid || v.mmsi || `vessel-${i}`,
    name: v.name || 'Unknown Vessel',
    type: v.type_specific || v.type || 'Cargo',
    flag: v.country_iso || v.flag || '—',
    status: v.navigational_status || v.status || 'Unknown',
    speed: v.speed ?? null,
    lat: v.lat ?? v.latitude ?? null,
    lng: v.lon ?? v.longitude ?? null,
    destination: v.destination || null,
    lastUpdate: v.last_position_epoch
      ? new Date(v.last_position_epoch * 1000).toISOString()
      : v.last_position_UTC || null,
  }));
}
