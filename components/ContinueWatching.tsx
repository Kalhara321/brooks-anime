"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import type { WatchHistoryEntry } from "@/lib/types";

type Item = WatchHistoryEntry & { progressPct: number };

export default function ContinueWatching() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const history = JSON.parse(
        localStorage.getItem("watch_history") || "[]"
      ) as WatchHistoryEntry[];
      setItems(
        history.slice(0, 10).map((entry) => {
          const saved = localStorage.getItem(`watch_progress_${entry.id}_${entry.ep}`);
          const progress = saved ? parseFloat(saved) : 0;
          return {
            ...entry,
            progressPct: Math.min(95, Math.max(10, (progress / 1200) * 100)),
          };
        })
      );
    } catch {
      setItems([]);
    }
  }, []);

  if (!items.length) return null;

  return (
    <section id="continue" className="mb-12">
      <h2 className="section-heading mb-5">Continue Watching</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={`${item.id}-${item.ep}`}
            href={`/${item.id}?ep=${item.ep}`}
            className="group shrink-0 w-[140px]"
          >
            <div className="neon-border rounded-2xl">
              <div className="anime-card-3d aspect-[2/3] bg-gradient-to-br from-violet-950 to-pink-950 flex items-center justify-center">
                <span className="font-display text-4xl text-white/10">{item.title.charAt(0)}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity z-10">
                  <div className="w-12 h-12 rounded-full btn-neon !p-0 flex items-center justify-center">
                    <Play size={20} fill="white" className="ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 z-10">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-400"
                    style={{ width: `${item.progressPct}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-zinc-300 line-clamp-2 group-hover:text-violet-300">
              {item.title}
            </p>
            <p className="text-[10px] text-zinc-600">EP {item.ep}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
