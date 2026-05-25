import Link from "next/link";
import Image from "next/image";
import { getAiringSchedule } from "@/lib/api";
import { getAnimePoster } from "@/lib/anime-utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function ScheduleStrip() {
  const schedule = await getAiringSchedule();
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;

  return (
    <section id="schedule" className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-heading">Airing Schedule</h2>
        <Link href="/schedule" className="text-xs font-bold text-violet-400 hover:text-pink-400 uppercase tracking-wider">
          Full calendar →
        </Link>
      </div>

      <div className="glass rounded-2xl p-5 border border-violet-500/15">
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {DAYS.map((day, i) => (
            <span
              key={day}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold ${
                i === dayIndex
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]"
                  : "bg-white/5 text-zinc-500"
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto scrollbar-hide">
          {schedule.slice(0, 9).map((anime) => (
            <Link
              key={anime.mal_id}
              href={`/${anime.mal_id}`}
              className="flex gap-3 p-2 rounded-xl hover:bg-violet-500/10 transition-colors group"
            >
              <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10">
                <Image src={getAnimePoster(anime)} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-cyan-400">{anime.broadcast?.time ?? "TBA"}</p>
                <p className="text-sm font-medium line-clamp-2 group-hover:text-violet-300">{anime.title}</p>
                <p className="text-[10px] text-zinc-600">EP {anime.airingEpisode?.episode ?? "?"}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
