import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getAnimeRecommendations } from "@/lib/api";
import type { JikanAnime } from "@/lib/types";
import { getAnimePoster } from "@/lib/anime-utils";

export default async function AISection() {
  const recommendations = await getAnimeRecommendations();
  const seen = new Set<number>();
  const anime: JikanAnime[] = [];

  for (const rec of recommendations) {
    const entry = rec.entry?.[0];
    if (!entry || seen.has(entry.mal_id)) continue;
    seen.add(entry.mal_id);
    anime.push(entry);
    if (anime.length >= 10) break;
  }

  if (!anime.length) return null;

  return (
    <section className="mb-12 relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 via-pink-600/10 to-cyan-600/10 rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative glass rounded-2xl p-6 md:p-8 border border-violet-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h2 className="section-heading !mb-0">AI Recommendations</h2>
            <p className="text-xs text-zinc-500 ml-5">Personalized picks for you</p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {anime.map((item) => (
            <Link
              key={item.mal_id}
              href={`/${item.mal_id}`}
              className="group shrink-0 w-[130px]"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-violet-500/30 group-hover:ring-pink-500/50 transition-all">
                <Image
                  src={getAnimePoster(item)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="130px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold line-clamp-2">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
