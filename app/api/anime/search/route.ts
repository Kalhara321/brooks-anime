import { searchAnime } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json([]);
  const data = await searchAnime(q);
  return NextResponse.json(data);
}
