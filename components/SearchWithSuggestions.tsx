"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { getAnimePoster } from "@/lib/anime-utils";
import type { JikanAnime } from "@/lib/types";

type Props = {
  className?: string;
  onNavigate?: () => void;
};

export default function SearchWithSuggestions({ className = "", onNavigate }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/anime/search?q=${encodeURIComponent(query.trim())}`);
        const data = (await res.json()) as JikanAnime[];
        setResults(data.slice(0, 6));
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="flex items-center glass rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500/40 transition-shadow">
        <Search className="ml-3 text-violet-400 shrink-0" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search anime..."
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none min-w-0"
        />
        {loading && <Loader2 className="mr-3 animate-spin text-violet-400" size={16} />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-[100] border border-violet-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
          {results.map((anime) => (
            <Link
              key={anime.mal_id}
              href={`/${anime.mal_id}`}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-3 p-3 hover:bg-violet-500/10 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={getAnimePoster(anime)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white line-clamp-1">{anime.title}</p>
                <p className="text-xs text-zinc-500">
                  {anime.type} · {anime.score?.toFixed(1) ?? "N/A"} ★
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
