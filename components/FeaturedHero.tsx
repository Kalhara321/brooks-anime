"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Bookmark, Play, Star } from "lucide-react";
import type { JikanAnime } from "@/lib/types";
import { formatGenres, getAnimeHeroImage, getAnimePoster } from "@/lib/anime-utils";

type Props = { anime: JikanAnime[] };

export default function FeaturedHero({ anime }: Props) {
  const slides = anime.slice(0, 8);
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, 9000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (!slides.length) return null;

  const current = slides[index];
  const image = getAnimeHeroImage(current);

  return (
    <section className="relative w-full mt-[72px] overflow-hidden">
      <div className="relative h-[min(88vh,680px)] min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.mal_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={current.title}
              fill
              priority
              className="object-cover object-center scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020208] via-[#020208]/90 to-[#020208]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020208] via-transparent to-[#020208]/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(168,85,247,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(236,72,153,0.15),transparent_40%)]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col justify-end pb-12 md:pb-16">
          <motion.div
            key={`c-${current.mal_id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full glass text-xs font-bold text-cyan-300 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ec4899]" />
              Featured · #{index + 1}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-neon-purple leading-[1.05] mb-2">
              {current.title}
            </h1>
            {current.title_japanese && (
              <p className="text-lg text-violet-300/80 mb-3 font-medium">
                {current.title_japanese}
              </p>
            )}
            <p className="text-sm text-violet-300/70 mb-4">{formatGenres(current, 4)}</p>

            {current.synopsis && (
              <p className="text-sm md:text-base text-zinc-400 line-clamp-3 leading-relaxed mb-6 max-w-2xl">
                {current.synopsis}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { label: "Score", value: current.score?.toFixed(1) ?? "—", icon: true },
                { label: "Year", value: String(current.year ?? "—") },
                { label: "Episodes", value: String(current.episodes ?? "—") },
                { label: "Rank", value: current.rank ? `#${current.rank}` : "—" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl px-4 py-2 min-w-[80px]">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">{s.label}</p>
                  <p className="text-lg font-bold text-white flex items-center gap-1">
                    {s.icon && <Star size={14} className="text-amber-400" fill="currentColor" />}
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/${current.mal_id}`} className="btn-neon px-8 py-3 rounded-xl">
                <Play size={18} fill="currentColor" /> Watch Now
              </Link>
              <button type="button" className="btn-neon-outline rounded-xl p-3" aria-label="Save">
                <Bookmark size={20} />
              </button>
            </div>
          </motion.div>

          {slides.length > 1 && (
            <div className="absolute bottom-8 right-4 md:right-6 flex items-center gap-3">
              <div className="hidden md:flex gap-2">
                {slides.slice(0, 6).map((s, i) => (
                  <button
                    key={s.mal_id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`relative w-11 h-16 rounded-lg overflow-hidden ring-2 transition-all ${
                      i === index
                        ? "ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                        : "ring-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={getAnimePoster(s)} alt="" fill className="object-cover" sizes="44px" />
                  </button>
                ))}
              </div>
              <div className="glass rounded-xl flex items-center gap-1 p-1">
                <button type="button" onClick={prev} className="p-2 hover:bg-white/10 rounded-lg">
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-bold tabular-nums px-2 text-zinc-400">
                  {index + 1}/{slides.length}
                </span>
                <button type="button" onClick={next} className="p-2 hover:bg-white/10 rounded-lg">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hologram-line mx-auto max-w-[1400px]" />
    </section>
  );
}
