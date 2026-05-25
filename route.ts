import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  const referer = req.nextUrl.searchParams.get('referer') || '';

  if (!url) return new Response('No URL', { status: 400 });

  const headers = {
    'User-Agent': 'Mozilla/5.0',
    'Referer': referer,
  };

  const response = await fetch(url, { headers });

  // If it's a TS segment, pipe the stream directly to the browser
  if (url.includes('.ts')) {
    return new Response(response.body, {
      headers: { 'Content-Type': 'video/mp2t' }
    });
  }

  // If it's an M3U8 playlist, we need to rewrite internal URLs
  let content = await response.text();
  const urlObj = new URL(url);
  const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

  // Logic to rewrite relative paths to absolute paths proxied through this route
  const lines = content.split('\n');
  const rewrittenLines = lines.map(line => {
    if (line.startsWith('#') || line.trim() === '') return line;

    let segmentUrl = line;
    if (!line.startsWith('http')) {
      // Convert relative segment path to absolute
      segmentUrl = new URL(line, baseUrl).href;
    }

    // Point the segment back to this proxy
    return `/api/anime/m3u8?url=${encodeURIComponent(segmentUrl)}&referer=${encodeURIComponent(referer)}`;
  });

  return new Response(rewrittenLines.join('\n'), {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*'
    }
  });
}