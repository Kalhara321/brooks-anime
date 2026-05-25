import type { JikanAnime } from "./types";

export function getAnimePoster(anime: JikanAnime): string {
  return (
    anime.images?.jpg?.large_image_url ??
    anime.images?.jpg?.image_url ??
    "https://cdn.myanimelist.net/images/spacer.gif"
  );
}

export function getAnimeHeroImage(anime: JikanAnime): string {
  return getAnimePoster(anime);
}

export function formatGenres(anime: JikanAnime, limit = 3): string {
  return (anime.genres ?? []).slice(0, limit).map((g) => g.name).join(", ");
}

export function splitAnimeLists(anime: JikanAnime[]) {
  const currentYear = new Date().getFullYear();

  const upcoming = anime.filter((a) =>
    a.status?.toLowerCase().includes("not yet aired")
  );
  const completed = anime.filter((a) => a.status === "Finished Airing");
  const newReleases = anime.filter(
    (a) => a.year != null && a.year >= currentYear - 1 && a.status !== "Not yet aired"
  );

  return {
    upcoming: upcoming.length > 0 ? upcoming : anime.slice(0, 8),
    completed: completed.length > 0 ? completed : anime.slice(8, 16),
    newReleases: newReleases.length > 0 ? newReleases : anime.slice(0, 8),
  };
}
