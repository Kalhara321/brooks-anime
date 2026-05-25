"use client";

import Link from "next/link";
import { X, Home, TrendingUp, Film, Grid3X3, Calendar, Users } from "lucide-react";
import SearchWithSuggestions from "@/components/SearchWithSuggestions";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#trending", label: "Trending", icon: TrendingUp },
  { href: "/#movies", label: "Movies", icon: Film },
  { href: "/#genres", label: "Genres", icon: Grid3X3 },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/community", label: "Community", icon: Users },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[min(320px,85vw)] glass border-l border-violet-500/20 p-6 flex flex-col animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-6">
          <span className="font-display font-bold text-neon">Menu</span>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
            <X size={22} />
          </button>
        </div>

        <SearchWithSuggestions className="mb-6" onNavigate={onClose} />

        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:text-white hover:bg-violet-500/10 transition-colors font-medium"
            >
              <Icon size={20} className="text-violet-400" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hologram-line my-4" />
        <p className="text-xs text-zinc-600 text-center">Brooks Anime © 2026</p>
      </aside>
    </div>
  );
}
