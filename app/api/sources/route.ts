/**
 * /app/api/sources/route.ts
 *
 * Client-side streaming source fetcher.
 *
 * WHY THIS EXISTS:
 * HiAnime / Zoro sources are often blocked when fetched directly from
 * Next.js server components (Cloudflare bot protection, CORS, geo-blocks).
 * By routing through this API handler the request originates from the
 * server but is triggered after hydration, giving you more flexibility
 * and allowing you to add caching, retries, and error handling in one place.
 *
 * USAGE from a Client Component:
 *   const res = await fetch(`/api/sources?episodeId=${episodeId}`);
 *   const { sources } = await res.json();
 */

import { NextRequest, NextResponse } from "next/server";
import { getStreamSources } from "@/lib/api";

export const runtime = "nodejs"; // keep as nodejs for full fetch support

export async function GET(req: NextRequest) {
  const episodeId = req.nextUrl.searchParams.get("episodeId");

  if (!episodeId) {
    return NextResponse.json(
      { error: "Missing episodeId query parameter" },
      { status: 400 }
    );
  }

  try {
    const data = await getStreamSources(episodeId);

    if (!data || !Array.isArray(data.sources) || data.sources.length === 0) {
      return NextResponse.json(
        {
          sources: [],
          message:
            "No sources returned from upstream API. The episode may not be available yet.",
        },
        { status: 200 }
      );
    }

    // Normalize and validate sources
    const sources = data.sources
      .filter(
        (s: any): s is { url: string } =>
          typeof s?.url === "string" && s.url.length > 0
      )
      .map((s: any) => ({
        url: s.url as string,
        quality: (s.quality ?? s.label ?? "auto") as string,
        isM3U8: (s.isM3U8 ?? (s.url as string).includes(".m3u8")) as boolean,
      }));

    // Cache for 5 minutes — streaming URLs expire so don't cache too long
    return NextResponse.json(
      { sources, subtitles: data.subtitles ?? [] },
      {
        status: 200,
        headers: { "Cache-Control": "private, max-age=300" },
      }
    );
  } catch (error: any) {
    console.error("[/api/sources] Error:", error);
    return NextResponse.json(
      {
        sources: [],
        error: "Failed to fetch streaming sources",
        detail: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
