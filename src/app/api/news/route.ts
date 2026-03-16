import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  image: string | null;
}

/** Specific image URLs known to be generic/logo placeholders */
const BLOCKED_IMAGE_URLS = [
  'https://ml.globenewswire.com/Resource/Download/908fb457-7f8e-4a08-9081-5565e3dfb3d7',
];

/** Reject images that are likely site logos, favicons, or icons rather than article images */
function isBadImage(url: string): boolean {
  // Block specific known bad URLs
  if (BLOCKED_IMAGE_URLS.includes(url)) return true;

  const lower = url.toLowerCase();

  // Generic resource download URLs (GlobeNewsWire etc.)
  if (lower.includes('/resource/download/')) return true;

  const logoPatterns = [
    'logo',
    'favicon',
    'icon',
    'brand',
    'avatar',
    'badge',
    'sprite',
    'placeholder',
    'default-image',
    'default_image',
    'no-image',
    'no_image',
    'thumbnail-default',
  ];
  if (logoPatterns.some((p) => lower.includes(p))) return true;

  // Reject very small images (common dimensions for logos/icons)
  const sizeMatch = lower.match(/(\d+)x(\d+)/);
  if (sizeMatch) {
    const w = parseInt(sizeMatch[1], 10);
    const h = parseInt(sizeMatch[2], 10);
    if (w < 200 || h < 120) return true;
  }

  return false;
}

export async function GET() {
  try {
    const apiKey = 'ad52f814f074461b8d8285054f7f7d7c';

    // Broader query focused on UAE/Gulf logistics, delivery, shipping, freight
    const query = encodeURIComponent(
      '(UAE OR "United Arab Emirates" OR Dubai OR "Abu Dhabi" OR Sharjah OR Ajman OR "Ras Al Khaimah" OR Fujairah) AND (logistics OR shipping OR delivery OR freight OR cargo OR "supply chain" OR port OR warehouse)'
    );

    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=50&language=en&apiKey=${apiKey}`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) throw new Error(`NewsAPI fetch failed: ${res.status}`);

    const data = await res.json();

    const filtered: NewsItem[] = (data.articles || [])
      .filter((article: Record<string, unknown>) => {
        if (!article.urlToImage) return false;
        if (isBadImage(article.urlToImage as string)) return false;
        if (!article.title || article.title === '[Removed]') return false;
        if (!article.description || article.description === '[Removed]') return false;
        return true;
      })
      .slice(0, 20)
      .map((article: Record<string, unknown>) => ({
        title: article.title as string,
        link: article.url as string,
        source: (article.source as Record<string, string>)?.name || '',
        pubDate: article.publishedAt as string,
        image: article.urlToImage as string,
      }));

    // Shuffle for variety on each refresh
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    const items = filtered;

    return NextResponse.json(
      { items },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json(
      { items: [], error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
