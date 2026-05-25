// components/EpisodeList.tsx
'use client';

type Props = {
  episodes: any[];
  currentEpisode: number;
  onEpisodeChange?: (ep: number) => void;
  totalEpisodes: number;
};

export default function EpisodeList({ episodes, currentEpisode, onEpisodeChange, totalEpisodes }: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Episodes</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto pr-2">
        {episodes.length > 0 ? (
          episodes.map((ep: any) => (
            <button
              key={ep.id || ep.number}
              onClick={() => onEpisodeChange?.(ep.number)}
              className={`p-4 rounded-xl text-sm font-medium transition-all ${
                currentEpisode === ep.number
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              EP {ep.number}
            </button>
          ))
        ) : (
          Array.from({ length: totalEpisodes }, (_, i) => (
            <button
              key={i}
              onClick={() => onEpisodeChange?.(i + 1)}
              className={`p-4 rounded-xl text-sm font-medium transition-all ${
                currentEpisode === i + 1 ? 'bg-violet-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              EP {i + 1}
            </button>
          ))
        )}
      </div>
    </div>
  );
}