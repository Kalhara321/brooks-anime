import Link from "next/link";
import Image from "next/image";
import { getAiringSchedule } from "@/lib/api";
import { getAnimePoster } from "@/lib/anime-utils";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function AiringSchedule() {
  const schedule = await getAiringSchedule();

  return (
    <section>
      <SectionHeader title="Airing Today" subtitle="Today's broadcast lineup" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schedule.slice(0, 12).map((anime) => (
          <Link key={anime.mal_id} href={`/${anime.mal_id}`} className="group">
            <div className="glass-panel-hover rounded-2xl p-4 flex gap-4">
              <div className="relative w-16 h-24 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10">
                <Image
                  src={getAnimePoster(anime)}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md">
                    EP {anime.airingEpisode?.episode ?? "?"}
                  </span>
                  <span className="text-[10px] font-bold text-orange-400">
                    {anime.broadcast?.time ?? "TBA"}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-zinc-200 line-clamp-2 group-hover:text-orange-400 transition-colors">
                  {anime.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  {anime.genres?.[0]?.name ?? "Anime"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
