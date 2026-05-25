import Image from "next/image";
import Link from "next/link";
import { getAnimeRecommendations } from "@/lib/api";
import type { JikanAnime } from "@/lib/types";

export default async function AIRecommendations() {
  const recommendations = await getAnimeRecommendations();

  const seenIds = new Set<number>();
  const uniqueAnime = recommendations
    .slice(0, 24)
    .map((rec) => rec.entry?.[0])
    .filter((anime): anime is JikanAnime => {
      if (!anime || seenIds.has(anime.mal_id)) return false;
      seenIds.add(anime.mal_id);
      return true;
    });

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Recommendations
            </span>
          </h2>
          <Link href="/recommendations" className="text-purple-400 hover:text-purple-300 transition-colors">
            View All
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-500">
          {uniqueAnime.slice(0, 12).map((anime) => (
            <Link
              key={anime.mal_id}
              href={`/${anime.mal_id}`}
              className="flex-shrink-0 w-48 group"
            >
              <div className="relative w-48 h-72 rounded-2xl overflow-hidden bg-[#0f172a]">
                <Image
                  src={
                    anime.images?.jpg?.large_image_url ??
                    anime.images?.jpg?.image_url ??
                    "https://cdn.myanimelist.net/images/spacer.gif"
                  }
                  alt={anime.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="192px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-3">
                  <h3 className="font-semibold text-sm line-clamp-2">{anime.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
