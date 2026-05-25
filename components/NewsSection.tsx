import Image from "next/image";
import Link from "next/link";
import { getAnimeNews } from "@/lib/api";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function NewsSection() {
  const news = await getAnimeNews();

  return (
    <section className="py-4">
      <SectionHeader title="Anime News" subtitle="Latest headlines from the community" />

      {news.length === 0 ? (
        <p className="text-zinc-500 text-center py-12 glass-panel rounded-2xl">
          No news available right now. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.slice(0, 6).map((item) => (
            <Link
              key={item.mal_id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-panel-hover rounded-2xl overflow-hidden block"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{item.summary}</p>
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>{item.author}</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
