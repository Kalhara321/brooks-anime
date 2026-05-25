import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { JikanAnime } from "@/lib/types";
import { getAnimePoster, formatGenres } from "@/lib/anime-utils";

type Props = {
  anime: JikanAnime;
  showWatch?: boolean;
};

export default function AnimeCard({ anime, showWatch = true }: Props) {
  const image = getAnimePoster(anime);
  const genres = formatGenres(anime, 2);

  return (
    <Link href={`/${anime.mal_id}`} className="group block w-[160px] sm:w-[180px] shrink-0">
      <div className="neon-border rounded-2xl">
        <div className="anime-card-3d aspect-[2/3] bg-zinc-950">
          <Image
            src={image}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="180px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020208] via-[#020208]/40 to-transparent" />

          {anime.score != null && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 px-2 py-0.5 rounded-lg glass text-amber-300 text-[10px] font-bold">
              <Star size={10} fill="currentColor" />
              {anime.score.toFixed(1)}
            </div>
          )}

          <div className="absolute top-2 left-2 z-10 flex gap-1">
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-500/90 text-white">
              SUB
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <div className="w-14 h-14 rounded-full btn-neon !p-0 flex items-center justify-center">
              <Play size={24} fill="white" className="text-white ml-0.5" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            {showWatch && (
              <span className="inline-block mb-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-gradient-to-r from-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Watch
              </span>
            )}
            <p className="text-[10px] text-violet-300/80 line-clamp-1">{genres}</p>
            <p className="text-[10px] text-zinc-500">
              {anime.episodes ? `${anime.episodes} eps` : "—"} · {anime.type ?? "TV"}
            </p>
          </div>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-zinc-200 line-clamp-2 group-hover:text-violet-300 transition-all leading-snug px-0.5">
        {anime.title}
      </h3>
    </Link>
  );
}
