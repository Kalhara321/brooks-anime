"use client";

import { useState } from "react";
import { Plus, Play, Trash2, GripVertical } from "lucide-react";

type PlaylistItem = {
  id: string;
  animeId: number;
  title: string;
  image: string;
  episode: number;
};

type PlaylistProps = {
  initialItems?: PlaylistItem[];
};

export default function Playlist({ initialItems = [] }: PlaylistProps) {
  const [items, setItems] = useState<PlaylistItem[]>(initialItems);
  const [isOpen, setIsOpen] = useState(false);
  const [animeInput, setAnimeInput] = useState("");

  const addToPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeInput.trim()) return;
  };

  const removeFromPlaylist = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearPlaylist = () => {
    setItems([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <Plus className="w-6 h-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full text-xs flex items-center justify-center font-bold">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div
            className="bg-[#0f172a] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-400" />
                  My Playlist
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={addToPlaylist} className="p-4 border-b border-purple-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={animeInput}
                  onChange={(e) => setAnimeInput(e.target.value)}
                  placeholder="Add anime to playlist..."
                  className="flex-1 bg-[#1e293b] border border-purple-500/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="p-4 overflow-y-auto max-h-64">
              {items.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Your playlist is empty</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item, index: number) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 bg-[#1e293b] rounded-xl p-3 group"
                    >
                      <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
                      <span className="text-purple-400 font-bold">{index + 1}</span>
                      <span className="flex-1 line-clamp-1">{item.title}</span>
                      <span className="text-xs text-gray-400">Ep {item.episode}</span>
                      <button
                        onClick={() => removeFromPlaylist(item.id)}
                        className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-purple-500/20">
                <button
                  onClick={clearPlaylist}
                  className="w-full py-2 text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Clear Playlist
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
