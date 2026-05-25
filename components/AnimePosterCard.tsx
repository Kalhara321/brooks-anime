import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { JikanAnime } from "@/lib/types";
import { getAnimePoster } from "@/lib/anime-utils";

export default function AnimePosterCard({ anime }: { anime: JikanAnime }) {
  const image = getAnimePoster(anime);
  const ep = anime.episodes ?? "?";

  return (
    <Link href={`/${anime.mal_id}`} className="group block">
      <div className="poster-card aspect-[2/3] ring-1 ring-white/[0.06]">
        <Image
          src={image}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          <Badge variant="sub">SUB</Badge>
        </div>

        {anime.score != null && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-amber-400 text-[10px] font-bold">
            <Star size={10} fill="currentColor" />
            {anime.score.toFixed(1)}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.6)] scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={22} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
          <div className="flex gap-1 mb-1">
            <Badge variant="dub">DUB</Badge>
            <Badge variant="default">EP {ep}</Badge>
          </div>
        </div>
      </div>

      <h3 className="mt-2.5 text-sm font-semibold text-zinc-200 line-clamp-2 group-hover:text-orange-400 transition-colors leading-snug">
        {anime.title}
      </h3>
    </Link>
  );
}
