"use client";

import { useState } from "react";
import { Play, Calendar, ExternalLink } from "lucide-react";

interface Episode {
  mal_id: number;
  title: string;
  episode: string;
  aired: string;
  forum_url: string;
}

export default function AnimeEpisodes({ episodes }: { episodes: Episode[] }) {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);

  if (!episodes || episodes.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-zinc-500 rounded-2xl">
        No episode data available for this series.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Play className="text-orange-500 fill-orange-500" size={20} />
          Episodes
        </h2>
        {activeEpisode && (
          <span className="text-xs font-mono bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30 animate-pulse">
            Watching Ep {activeEpisode}
          </span>
        )}
      </div>
      
      <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {episodes.map((ep) => (
          <button 
            key={ep.mal_id} 
            onClick={() => setActiveEpisode(ep.mal_id)}
            className={`w-full text-left glass-panel-hover p-4 rounded-xl flex items-center justify-between group transition-all border ${
              activeEpisode === ep.mal_id ? "border-orange-500/50 bg-orange-500/5" : "border-transparent"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`font-mono font-bold text-lg w-8 transition-colors ${
                activeEpisode === ep.mal_id ? "text-white" : "text-orange-500"
              }`}>
                {ep.mal_id.toString().padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-zinc-200 font-semibold group-hover:text-white transition-colors">
                  {ep.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                  <Calendar size={12} />
                  {ep.aired ? new Date(ep.aired).toLocaleDateString() : "Airing Date TBD"}
                </div>
              </div>
            </div>
            
            {ep.forum_url && (
              <a 
                href={ep.forum_url} 
                target="_blank" 
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-orange-400 transition-all"
                title="Discuss on MyAnimeList"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}