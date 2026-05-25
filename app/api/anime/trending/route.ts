import { getTrendingAnime } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getTrendingAnime();
  return NextResponse.json(data);
}
