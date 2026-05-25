"use client";

import { useEffect, useState, useCallback } from "react";
import AnimeCard from "./AnimeCard";
import SearchBar from "./SearchBar";

import type { JikanAnime } from "@/lib/types";

async function fetchAnimeList(query: string): Promise<JikanAnime[]> {
  const url = query
    ? `/api/anime/search?q=${encodeURIComponent(query)}`
    : "/api/anime/trending";
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export default function Trending() {
  const [animeList, setAnimeList] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAnimeList("");
      setAnimeList(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      await fetchTrending();
      return;
    }
    const data = await fetchAnimeList(query);
    setAnimeList(data);
  }, [fetchTrending]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      <h2 className="text-4xl font-bold mb-10">
        Trending Anime
      </h2>

      <SearchBar onSearch={handleSearch} />

      {loading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {[...Array(8)].map((_, i: number) => (
            <div
              key={i}
              className="h-[340px] rounded-2xl bg-[#111827] animate-pulse"
            />
          ))}

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {animeList.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              id={anime.mal_id}
              title={anime.title}
              image={anime.images.jpg?.large_image_url ?? anime.images.jpg?.image_url ?? ""}
              score={anime.score ?? undefined}
            />

          ))}

        </div>

      )}

    </section>
  );
}