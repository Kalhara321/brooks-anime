import {
  getAnimeById,
  getAnimeRecommendations,
} from "@/lib/api";

import VideoPlayerWrapper from "@/components/VideoPlayerWrapper";
import EpisodeList from "@/components/EpisodeList";
import Comments from "@/components/Comments";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberBackground from "@/components/effects/CyberBackground";
import AnimeCard from "@/components/ui/AnimeCard";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Bookmark, Download } from "lucide-react";

import { getAnimePoster } from "@/lib/anime-utils";
import type { JikanAnime } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AnimeDetailsPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { ep } = await searchParams;

  const anime = await getAnimeById(id);

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Anime not found
      </div>
    );
  }

  // ── Recommendations ──────────────────────────────────────────────────────
  const recs = await getAnimeRecommendations();
  const related: JikanAnime[] = [];
  const seen = new Set<number>([anime.mal_id]);

  for (const r of recs) {
    const entry = r.entry?.[0];
    if (entry && !seen.has(entry.mal_id)) {
      seen.add(entry.mal_id);
      related.push(entry);
      if (related.length >= 8) break;
    }
  }

  const currentEpisode = ep ? parseInt(ep, 10) : 1;
  const totalEpisodes = anime.episodes || 12;
  const poster = getAnimePoster(anime);


  return (
    <main className="relative min-h-screen bg-[#020208] text-white">
      <CyberBackground />

      <div className="relative z-10">
        <Navbar />

        {/* HERO */}
        <div className="relative h-[50vh] min-h-[360px] mt-[72px]">
          <Image
            src={poster}
            alt={anime.title}
            fill
            className="object-cover object-top opacity-40 blur-sm scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020208]/40 via-[#020208]/80 to-[#020208]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-48 relative z-10 pb-20">

          {/* TOP SECTION */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-8 mb-10">

            {/* POSTER */}
            <div className="neon-border rounded-2xl mx-auto lg:mx-0">
              <div className="relative w-full max-w-[240px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)]">
                <Image
                  src={poster}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="240px"
                  priority
                />
              </div>
            </div>

            {/* DETAILS */}
            <div className="pt-4">
              <h1 className="font-display text-3xl md:text-5xl font-black text-neon-purple leading-tight">
                {anime.title}
              </h1>

              {anime.title_japanese && (
                <p className="text-xl text-violet-300/70 mt-1">
                  {anime.title_japanese}
                </p>
              )}

              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-zinc-500 mt-1">{anime.title_english}</p>
              )}

              {/* STATS */}
              <div className="flex flex-wrap gap-2 mt-5">
                {anime.score != null && (
                  <span className="glass px-3 py-1.5 rounded-lg text-sm font-bold text-amber-400 flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    {anime.score.toFixed(1)}
                  </span>
                )}
                {anime.rank && (
                  <span className="glass px-3 py-1.5 rounded-lg text-sm text-zinc-300">
                    Rank #{anime.rank}
                  </span>
                )}
                {anime.popularity && (
                  <span className="glass px-3 py-1.5 rounded-lg text-sm text-zinc-400">
                    Pop #{anime.popularity}
                  </span>
                )}
              </div>

              {/* GENRES */}
              <div className="flex flex-wrap gap-2 mt-4">
                {anime.genres?.map((g) => (
                  <span
                    key={g.mal_id}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/25"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* SYNOPSIS */}
              {anime.synopsis && (
                <p className="mt-6 text-zinc-400 leading-relaxed text-sm md:text-base max-w-3xl">
                  {anime.synopsis}
                </p>
              )}

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href={`/${id}?ep=1`} className="btn-neon rounded-xl">
                  Watch EP 1
                </Link>
                <button
                  type="button"
                  className="btn-neon-outline rounded-xl flex items-center gap-2"
                >
                  <Bookmark size={18} />
                  Watchlist
                </button>
                <button
                  type="button"
                  className="btn-neon-outline rounded-xl flex items-center gap-2"
                >
                  <Heart size={18} />
                  Favorite
                </button>
              </div>

              {/* DOWNLOAD */}
              <div className="flex flex-wrap gap-2 mt-6">
                {["1080p", "720p", "480p"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass text-xs font-bold text-zinc-400 hover:text-white"
                  >
                    <Download size={14} />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TRAILER */}
          {anime.trailer?.embed_url && (
            <section className="mb-10">
              <h2 className="section-heading mb-4">Trailer</h2>
              <div className="aspect-video rounded-2xl overflow-hidden glass ring-1 ring-violet-500/20">
                <iframe
                  src={anime.trailer.embed_url}
                  title="Trailer"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* VIDEO PLAYER — sources fetched client-side to bypass server-side host blocks */}
          <section className="mb-10">
            <VideoPlayerWrapper
              animeId={id}
              animeTitle={anime.title}
              episodeNumber={currentEpisode}
              totalEpisodes={totalEpisodes}
            />
          </section>

          {/* EPISODES */}
          <EpisodeList
            episodes={Array.from({ length: totalEpisodes }, (_, i) => ({
              mal_id: i + 1,
              title: `Episode ${i + 1}`,
            }))}
            currentEpisode={currentEpisode}
          />

          {/* RELATED */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="section-heading mb-6">Related Anime</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {related.map((r) => (
                  <AnimeCard key={r.mal_id} anime={r} />
                ))}
              </div>
            </section>
          )}

          {/* COMMENTS */}
          <section className="mt-12">
            <h2 className="section-heading mb-6">Reviews & Comments</h2>
            <Comments animeId={parseInt(id, 10)} />
          </section>
        </div>

        <Footer />
      </div>
    </main>
  );
}