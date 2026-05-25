import Link from "next/link";
import { GENRES } from "@/lib/constants";

export default function GenreGrid() {
  return (
    <section className="mb-12">
      <h2 className="section-heading mb-6">Browse by Genre</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {GENRES.map((genre) => (
          <Link
            key={genre.id}
            href={`/#latest-updates`}
            className="group relative overflow-hidden rounded-xl glass glass-hover p-5 min-h-[88px] flex items-end"
          >
            <div
              className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${genre.color}`}
            />
            <span className="relative font-display text-sm font-bold text-white group-hover:text-neon transition-colors">
              {genre.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
