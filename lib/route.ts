import { NextRequest, NextResponse } from "next/server";
import { getConsumetEpisodes } from "@/lib/api";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const data = await getConsumetEpisodes(title);

    if (!data) {
      return NextResponse.json(
        { error: "Anime not found on streaming servers" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("[API Episodes Error]:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}