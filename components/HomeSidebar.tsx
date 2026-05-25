import Link from "next/link";
import Image from "next/image";
import type { JikanAnime } from "@/lib/types";
import { getAnimePoster } from "@/lib/anime-utils";
import { Star, Calendar, TrendingUp } from "lucide-react";

type Props = {
  trending: JikanAnime[];
  schedule: JikanAnime[];
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HomeSidebar({ trending, schedule }: Props) {
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;

  return (
    <aside className="space-y-5 xl:sticky xl:top-20 xl:self-start">
      <div className="glass-panel-hover rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-orange-500" />
            Top Trending
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 rounded-full">
            Live
          </span>
        </div>

        <div className="space-y-1">
          {trending.slice(0, 8).map((anime, i) => (
            <Link
              key={anime.mal_id}
              href={`/${anime.mal_id}`}
              className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-white/[0.04] transition-all group"
            >
              <span
                className={`font-display text-lg font-extrabold w-6 tabular-nums shrink-0 ${
                  i === 0
                    ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    : i < 3
                      ? "text-orange-500"
                      : "text-zinc-600"
                }`}
              >
                {i + 1}
              </span>
              <div className="relative w-10 h-14 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10">
                <Image
                  src={getAnimePoster(anime)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-300 line-clamp-2 group-hover:text-orange-400 transition-colors leading-snug">
                  {anime.title}
                </p>
                {anime.score != null && (
                  <p className="text-[10px] text-amber-500/90 flex items-center gap-0.5 mt-0.5 font-semibold">
                    <Star size={10} fill="currentColor" />
                    {anime.score.toFixed(1)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-panel-hover rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" />
            Schedule
          </h2>
          <Link
            href="/schedule"
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="flex gap-1 mb-4">
          {DAYS.map((day, i) => (
            <span
              key={day}
              className={`flex-1 text-center text-[10px] font-bold py-2 rounded-lg transition-colors ${
                i === dayIndex
                  ? "bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-[0_4px_12px_rgba(249,115,22,0.35)]"
                  : "bg-white/[0.03] text-zinc-600"
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className="space-y-3 max-h-[340px] overflow-y-auto scrollbar-thin pr-1">
          {schedule.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No schedule data</p>
          ) : (
            schedule.slice(0, 10).map((anime) => (
              <div
                key={anime.mal_id}
                className="group pl-3 border-l-2 border-orange-500/30 hover:border-orange-500 transition-colors py-1"
              >
                <p className="text-[11px] font-bold text-orange-400 mb-0.5 tabular-nums">
                  {anime.broadcast?.time ?? "TBA"}
                </p>
                <Link
                  href={`/${anime.mal_id}`}
                  className="text-sm text-zinc-300 hover:text-white line-clamp-2 transition-colors font-medium"
                >
                  {anime.title}
                </Link>
                <p className="text-[10px] text-zinc-600 mt-0.5">
                  Episode {anime.airingEpisode?.episode ?? "?"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
