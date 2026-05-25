"use client";

import { useState, useMemo } from "react";
import AnimeCard from "@/components/ui/AnimeCard";
import type { JikanAnime } from "@/lib/types";
import { SEASONS, type SeasonName } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LABELS: Record<SeasonName, string> = {
  winter: "❄️ Winter",
  spring: "🌸 Spring",
  summer: "☀️ Summer",
  fall: "🍂 Fall",
};

type Props = {
  seasonal: JikanAnime[];
  fallback: JikanAnime[];
};

export default function SeasonPicker({ seasonal, fallback }: Props) {
  const [active, setActive] = useState<SeasonName>("spring");

  const filtered = useMemo(() => {
    const fromSeason = seasonal.filter(
      (a) => a.season?.toLowerCase() === active
    );
    if (fromSeason.length >= 4) return fromSeason;
    return fallback.filter((a) => a.season?.toLowerCase() === active).length > 0
      ? fallback.filter((a) => a.season?.toLowerCase() === active)
      : fallback.slice(0, 12);
  }, [seasonal, fallback, active]);

  return (
    <section className="mb-12">
      <h2 className="section-heading mb-5">Seasonal Anime</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {SEASONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(s)}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300",
              active === s
                ? "btn-neon !py-2 !px-5"
                : "glass text-zinc-400 hover:text-white hover:border-violet-500/30"
            )}
          >
            {LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {filtered.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </section>
  );
}
