"use client";

import { useState, useMemo } from "react";
import AnimePosterCard from "@/components/AnimePosterCard";
import SectionHeader from "@/components/ui/SectionHeader";
import type { JikanAnime } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "sub" | "dub";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sub", label: "Sub" },
  { id: "dub", label: "Dub" },
];

type Props = {
  anime: JikanAnime[];
};

export default function LatestUpdates({ anime }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => anime, [anime, filter]);

  return (
    <section id="latest-updates" className="mb-12">
      <SectionHeader
        title="Latest Updates"
        subtitle="Fresh episodes & trending series"
        action={
          <div className="flex gap-1 p-1 rounded-xl glass-panel">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "filter-pill",
                  filter === f.id ? "filter-pill-active" : "filter-pill-inactive"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {list.slice(0, 18).map((item) => (
          <AnimePosterCard key={item.mal_id} anime={item} />
        ))}
      </div>
    </section>
  );
}
