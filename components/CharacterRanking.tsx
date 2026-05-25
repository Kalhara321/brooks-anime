import Image from "next/image";
import { getTopCharacters } from "@/lib/api";
import SectionHeader from "@/components/ui/SectionHeader";
import { Heart } from "lucide-react";

export default async function CharacterRanking() {
  const allCharacters = await getTopCharacters();
  // Deduplicate by mal_id to prevent "duplicate key" console errors
  // and ensure we only show characters with valid names and images
  const characters = Array.from(
    new Map(allCharacters.map((char) => [char.mal_id, char])).values()
  ).filter((char) => char.name && char.images?.jpg?.image_url);

  if (characters.length === 0) return null;

  return (
    <section className="mb-12">
      <SectionHeader 
        title="Top Characters" 
        subtitle="The community's most loved personalities" 
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {characters.slice(0, 10).map((char, index) => (
          <div
            key={char.mal_id}
            className="group glass-panel-hover rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={char.images!.jpg!.image_url!}
                alt={char.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              
              {/* Rank Badge */}
              <div className={`absolute top-3 left-3 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold z-10 shadow-lg ${
                index === 0 ? "bg-amber-400 text-amber-950 shadow-amber-500/20" :
                index === 1 ? "bg-zinc-300 text-zinc-900 shadow-zinc-400/20" :
                index === 2 ? "bg-orange-400 text-orange-950 shadow-orange-500/20" :
                "bg-black/60 backdrop-blur-md text-white border border-white/10"
              }`}>
                {index + 1}
              </div>
            </div>

            <div className="p-3.5 mt-auto">
              <h3 className="font-bold text-sm text-zinc-200 line-clamp-1 group-hover:text-orange-400 transition-colors">
                {char.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Heart size={12} className="text-pink-500" fill="currentColor" />
                <span className="text-[11px] font-semibold text-zinc-500">
                  {char.favorites?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
