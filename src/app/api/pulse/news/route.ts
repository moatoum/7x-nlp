import { NextResponse } from 'next/server';
import type { PulseNewsItem } from '@/lib/pulse-types';

export const dynamic = 'force-dynamic';

interface NewsApiArticle {
  title?: string;
  source?: { name?: string };
  url?: string;
  publishedAt?: string;
  description?: string;
  urlToImage?: string;
}

const API_KEY = process.env.NEWSAPI_KEY || '';

// In-memory cache (5 min TTL)
let cache: { data: PulseNewsItem[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ articles: [] }, { headers: { 'Cache-Control': 'public, s-maxage=300' } });
    }

    // Return cached data if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(
        { articles: cache.data },
        { headers: { 'Cache-Control': 'public, s-maxage=300' } }
      );
    }

    const url = `https://newsapi.org/v2/everything?q=logistics+shipping+UAE&sortBy=publishedAt&pageSize=6&apiKey=${API_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (!res.ok) {
      throw new Error(`NewsAPI returned ${res.status}`);
    }

    const json = await res.json();
    const rawArticles = json.articles || [];

    const articles: PulseNewsItem[] = rawArticles.map((a: NewsApiArticle, i: number) => ({
      id: `news-${i}-${Date.now()}`,
      title: a.title || 'Untitled',
      source: a.source?.name || 'Unknown',
      url: a.url || '#',
      publishedAt: a.publishedAt || new Date().toISOString(),
      description: a.description || null,
      imageUrl: a.urlToImage || null,
    }));

    // Update cache
    cache = { data: articles, timestamp: Date.now() };

    return NextResponse.json(
      { articles },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    );
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { articles: [], error: 'Failed to fetch news' },
      { status: 200 }
    );
  }
}
