import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-5 md:p-6 mb-10 group">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-violet-600/10 pointer-events-none" />
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_24px_rgba(249,115,22,0.4)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white mb-1">
              Stream in cinematic HD
            </p>
            <p className="text-sm text-zinc-400 max-w-md">
              Thousands of anime titles, zero clutter. Trending picks updated daily from
              MyAnimeList.
            </p>
          </div>
        </div>

        <Link
          href="/#latest-updates"
          className="inline-flex items-center gap-2 shrink-0 text-sm font-bold text-orange-400 hover:text-orange-300 group/btn transition-colors"
        >
          Start browsing
          <ArrowRight
            size={18}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
}
