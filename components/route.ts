import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Proxy API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch from mirror" }, { status: 500 });
  }
}