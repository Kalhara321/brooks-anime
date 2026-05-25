import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { JikanAnime } from "@/lib/types";
import { getAnimePoster } from "@/lib/anime-utils";

export default function AnimeListRow({ anime }: { anime: JikanAnime }) {
  return (
    <Link
      href={`/${anime.mal_id}`}
      className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl group hover:bg-white/[0.04] transition-all"
    >
      <div className="relative w-11 h-[3.25rem] shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-orange-500/40 transition-all">
        <Image
          src={getAnimePoster(anime)}
          alt={anime.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="44px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-300 line-clamp-2 group-hover:text-orange-400 transition-colors leading-snug">
          {anime.title}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <Badge variant="sub">SUB</Badge>
          <Badge variant="dub">DUB</Badge>
          {anime.type && <Badge variant="tv">{anime.type}</Badge>}
        </div>
      </div>
    </Link>
  );
}
