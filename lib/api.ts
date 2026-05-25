// lib/api.ts
import type {
  JikanAnime,
  JikanApiResponse,
  JikanCharacter,
  JikanNewsItem,
  JikanRawNewsItem,
  JikanRecommendation,
} from "./types";

const FALLBACK_NEWS_ANIME_IDS = [21, 5114, 9253, 20];
const BASE_URL = "https://api.jikan.moe/v4";

const CONSUMET_MIRRORS = [
  "https://c.delusionz.xyz/anime/gogoanime",
  "https://consumet-api-fawn.vercel.app/anime/gogoanime",
  "https://consumet.pages.dev/anime/gogoanime",
  "https://consumet-instance.vercel.app/anime/gogoanime",
  "https://api.consumet.org/anime/gogoanime",
];

// ─── Jikan Rate Limit ─────────────────────────────────────────────────────
let lastRequestTime = 0;
const REQUEST_DELAY = 350;

async function waitForRateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < REQUEST_DELAY) {
    await new Promise((r) => setTimeout(r, REQUEST_DELAY - elapsed));
  }
  lastRequestTime = Date.now();
}

async function fetchWithRetry<T>(endpoint: string, retries = 5): Promise<T | null> {
  for (let i = 0; i < retries; i++) {
    try {
      await waitForRateLimit();
      const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 60 } });

      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      if (!res.ok) continue;

      const text = await res.text();
      return text ? (JSON.parse(text) as T) : null;
    } catch {
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return null;
}

export async function getAiringSchedule(): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>("/seasons/now");
  return data?.data ?? [];
}

export async function getTrendingAnime(): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>("/top/anime?filter=bypopularity");
  return data?.data ?? [];
}

export async function getSeasonNow(): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>("/seasons/now");
  return data?.data ?? [];
}

export async function getTopAnimeByFilter(filter: string): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>(`/top/anime?filter=${filter}`);
  return data?.data ?? [];
}

// ─── Consumet Helpers ─────────────────────────────────────────────────────
async function consumetFetch(path: string) {
  for (const baseUrl of CONSUMET_MIRRORS) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.results?.length > 0) return { baseUrl, data };
    } catch {}
  }
  return null;
}

const sanitizeTitle = (title: string) =>
  title
    .replace(/\s\((TV|Movie|Special|OVA|ONA|Uncensored|Dub|Sub|Part\s?\d+)\)/gi, "")
    .replace(/\s(hen|arc|season\s?\d+|movie)$/gi, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// ─── Main Functions ───────────────────────────────────────────────────────
export async function getConsumetEpisodes(title: string) {
  try {
    let cleanTitle = sanitizeTitle(title);
    let result = await consumetFetch(`/${encodeURIComponent(cleanTitle)}`);

    if (!result?.data?.results?.length) {
      const broad = title.split(/[^\w]/).filter(w => w.length > 2).slice(0, 2).join(" ");
      if (broad) result = await consumetFetch(`/${encodeURIComponent(broad)}`);
    }

    if (!result) return null;

    const { baseUrl, data } = result;
    const bestMatch = data.results.sort((a: any, b: any) =>
      Math.abs(a.title.length - title.length) - Math.abs(b.title.length - title.length)
    )[0];

    if (!bestMatch?.id) return null;

    const infoRes = await fetch(`${baseUrl}/info/${bestMatch.id}`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(10000),
    });

    if (!infoRes.ok) return null;
    return await infoRes.json();
  } catch (e) {
    console.error("[getConsumetEpisodes]", e);
    return null;
  }
}

export async function getStreamSources(episodeId: string) {
  for (const baseUrl of CONSUMET_MIRRORS) {
    try {
      const res = await fetch(`${baseUrl}/watch/${episodeId}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data?.sources) && data.sources.length > 0) {
        return data;
      }
    } catch {}
  }
  return { sources: [] };
}

// Jikan functions (keep your existing ones)
export async function getAnimeById(id: string): Promise<JikanAnime | null> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime>>(`/anime/${id}/full`);
  return data?.data ?? null;
}

export async function getAnimeRecommendations() {
  const data = await fetchWithRetry<JikanApiResponse<JikanRecommendation[]>>("/recommendations/anime");
  return data?.data ?? [];
}

// Add your other Jikan functions here...