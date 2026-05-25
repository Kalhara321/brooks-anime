import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AnimeCard from "@/components/ui/AnimeCard";
import type { JikanAnime } from "@/lib/types";

type Props = {
  title: string;
  subtitle?: string;
  anime: JikanAnime[];
  href?: string;
  limit?: number;
};

export default function AnimeRow({
  title,
  subtitle,
  anime,
  href,
  limit = 16,
}: Props) {
  const items = anime.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between gap-4 mb-5 px-0.5">
        <div>
          <h2 className="section-heading">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-500 mt-1 ml-5">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-pink-400 transition-colors uppercase tracking-wider"
          >
            View all <ChevronRight size={14} />
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
        {items.map((item) => (
          <AnimeCard key={item.mal_id} anime={item} />
        ))}
      </div>
    </section>
  );
}
