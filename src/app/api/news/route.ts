import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  image: string | null;
}

function extractSourceFromTitle(title: string): { cleanTitle: string; source: string } {
  const match = title.match(/^(.*)\s-\s([^-]+)$/);
  if (match) return { cleanTitle: match[1].trim(), source: match[2].trim() };
  return { cleanTitle: title, source: '' };
}

function extractRealUrl(bingUrl: string): string {
  try {
    const urlParam = new URL(bingUrl).searchParams.get('url');
    if (urlParam) return urlParam;
  } catch { /* ignore */ }
  return bingUrl;
}

async function fetchOgImage(articleUrl: string): Promise<string | null> {
  try {
    const res = await fetch(articleUrl, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    const ogMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );
    if (ogMatch?.[1]) return ogMatch[1];

    const twMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );
    if (twMatch?.[1]) return twMatch[1];

    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const query = encodeURIComponent('UAE logistics');
    const url = `https://www.bing.com/news/search?q=${query}&format=rss&count=10&mkt=en-US&setlang=en`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/xml, application/rss+xml, application/xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const rawItems: { title: string; link: string; source: string; pubDate: string; image: string | null }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && rawItems.length < 12) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const sourceMatch = itemXml.match(/<News:Source>(.*?)<\/News:Source>/i);
      const imageMatch = itemXml.match(/<News:Image>(.*?)<\/News:Image>/i);

      const rawTitle = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
      const { cleanTitle, source: titleSource } = extractSourceFromTitle(rawTitle);
      const rawLink = linkMatch ? linkMatch[1] : '';
      const link = extractRealUrl(rawLink.replace(/&amp;/g, '&'));
      const pubDate = pubDateMatch ? pubDateMatch[1] : '';
      const source = sourceMatch ? sourceMatch[1] : titleSource;

      // Bing thumbnail — add size params for a proper resolution
      let image: string | null = null;
      if (imageMatch?.[1]) {
        const imgUrl = imageMatch[1].replace(/&amp;/g, '&');
        image = `${imgUrl}&w=600&h=400&c=7`;
      }

      if (cleanTitle && link) {
        rawItems.push({ title: cleanTitle, link, source, pubDate, image });
      }
    }

    // For items missing images, try fetching og:image from the article
    const itemsWithImages = await Promise.all(
      rawItems.map(async (item) => {
        if (item.image) return item;
        const ogImage = await fetchOgImage(item.link);
        return { ...item, image: ogImage };
      })
    );

    // Only return items that have images
    const itemsFiltered = itemsWithImages.filter((item) => item.image);

    return NextResponse.json({ items: itemsFiltered }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json({ items: [], error: 'Failed to fetch news' }, { status: 500 });
  }
}
