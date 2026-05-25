// lib/api.ts
import type {
  JikanAnime,
  JikanApiResponse,
  JikanCharacter,
  JikanNewsItem,
  JikanRawNewsItem,
  JikanRecommendation,
} from "./types";

const BASE_URL = "https://api.jikan.moe/v4";

const CONSUMET_MIRRORS = [
  "https://c.delusionz.xyz/anime/gogoanime",
  "https://consumet-api-fawn.vercel.app/anime/gogoanime",
  "https://consumet.pages.dev/anime/gogoanime",
  "https://consumet-instance.vercel.app/anime/gogoanime",
  "https://api.consumet.org/anime/gogoanime",
];

/**
 * Jikan (MAL) IDs used to fetch news if the main request fails.
 * IDs: One Piece, Fullmetal Alchemist, Steins;Gate, Naruto.
 */
const FALLBACK_NEWS_ANIME_IDS = [21, 5114, 9253, 20];


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
      const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 3600 } });

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
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>("/schedules");
  return data?.data ?? [];
}

export async function getTrendingAnime(): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>(
    "/top/anime?filter=bypopularity"
  );
  return data?.data ?? [];
}

export async function getSeasonNow(): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>(
    "/seasons/now"
  );
  return data?.data ?? [];
}

export async function getTopAnimeByFilter(filter: string): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>(
    `/top/anime?filter=${filter}`
  );
  return data?.data ?? [];
}

export async function searchAnime(query: string): Promise<JikanAnime[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime[]>>(`/anime?q=${encodeURIComponent(query)}`);
  return data?.data ?? [];
}

export async function getAnimeNews() {
  for (const id of FALLBACK_NEWS_ANIME_IDS) {
    const data = await fetchWithRetry<JikanApiResponse<any[]>>(`/anime/${id}/news`);
    if (data?.data && data.data.length > 0) {
      return data.data.map((item: any) => ({
        mal_id: item.mal_id,
        url: item.url,
        title: item.title,
        date: item.date,
        author: item.author_username,
        summary: item.excerpt,
        image: item.images?.jpg?.image_url,
      }));
    }
  }
  return [];
}

// ─── Consumet Helpers ─────────────────────────────────────────────────────
async function consumetFetch(path: string) {
  for (const baseUrl of CONSUMET_MIRRORS) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        next: { revalidate: 1800 },
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
    const infoData = await infoRes.json();
    return {
      ...infoData,
      totalEpisodes: infoData.totalEpisodes || infoData.episodes?.length || 0,
    };
  } catch (e) {
    console.error("[getConsumetEpisodes]", e);
    return null;
  }
}

/**
 * Fetches streaming links for a specific Gogoanime episode ID.
 * Uses server-side fetching to bypass CORS.
 */
export async function getStreamSources(episodeId: string): Promise<any> {
  for (const baseUrl of CONSUMET_MIRRORS) {
    try {
      const res = await fetch(`${baseUrl}/watch/${episodeId}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.sources?.length > 0) return data;
    } catch {}
  }
  return { sources: [] };
}

/**
 * Fetches detailed info for a single anime using its MAL ID.
 */
export async function getAnimeById(id: string): Promise<JikanAnime | null> {
  const data = await fetchWithRetry<JikanApiResponse<JikanAnime>>(`/anime/${id}/full`);
  return data?.data ?? null;
}

/**
 * Fetches the list of episodes from Jikan (MyAnimeList).
 */
export async function getAnimeEpisodes(id: string) {
  const data = await fetchWithRetry<JikanApiResponse<any[]>>(`/anime/${id}/episodes`);
  return data?.data ?? [];
}

/**
 * Fetches characters for a specific anime ID.
 */
export async function getAnimeCharacters(id: number): Promise<JikanCharacter[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanCharacter[]>>(`/anime/${id}/characters`);
  return data?.data ?? [];
}

/**
 * Fetches general anime recommendations.
 */
export async function getAnimeRecommendations(): Promise<JikanRecommendation[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanRecommendation[]>>("/recommendations/anime");
  return data?.data ?? [];
}

/**
 * Fetches similar anime recommendations based on a specific MAL ID.
 */
export async function getAnimeRecommendationsById(id: number): Promise<JikanRecommendation[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanRecommendation[]>>(`/anime/${id}/recommendations`);
  return data?.data ?? [];
}

export async function getTopCharacters(): Promise<JikanCharacter[]> {
  const data = await fetchWithRetry<JikanApiResponse<JikanCharacter[]>>("/top/characters");
  return data?.data ?? [];
}