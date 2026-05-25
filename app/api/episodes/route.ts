import { NextRequest, NextResponse } from "next/server";
import { getConsumetEpisodes } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");

  if (!title) {
    return NextResponse.json(
      { error: "Missing title query parameter" },
      { status: 400 }
    );
  }

  try {
    const data = await getConsumetEpisodes(title);

    if (!data) {
      return NextResponse.json(
        { episodes: [], totalEpisodes: 0 },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        episodes: data.episodes ?? [],
        totalEpisodes: data.totalEpisodes ?? data.episodes?.length ?? 0,
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, max-age=1800" },
      }
    );
  } catch (error: any) {
    console.error("[/api/episodes] Error:", error);
    return NextResponse.json(
      {
        episodes: [],
        totalEpisodes: 0,
        error: "Failed to fetch episodes",
        detail: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
