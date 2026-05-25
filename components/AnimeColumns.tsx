import AnimeListRow from "@/components/AnimeListRow";
import SectionHeader from "@/components/ui/SectionHeader";
import type { JikanAnime } from "@/lib/types";

type ColumnProps = {
  title: string;
  accent: string;
  anime: JikanAnime[];
};

function Column({ title, accent, anime }: ColumnProps) {
  return (
    <div className="glass-panel-hover rounded-2xl p-5 h-full">
      <h3 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${accent}`} />
        {title}
      </h3>
      <div className="space-y-0.5 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {anime.slice(0, 10).map((item) => (
          <AnimeListRow key={item.mal_id} anime={item} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  newReleases: JikanAnime[];
  upcoming: JikanAnime[];
  completed: JikanAnime[];
};

export default function AnimeColumns({ newReleases, upcoming, completed }: Props) {
  return (
    <section className="mt-14">
      <SectionHeader
        title="Discover More"
        subtitle="New, upcoming, and completed series"
        className="mb-8"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Column title="New Releases" accent="bg-emerald-500" anime={newReleases} />
        <Column title="Upcoming" accent="bg-violet-500" anime={upcoming} />
        <Column title="Completed" accent="bg-orange-500" anime={completed} />
      </div>
    </section>
  );
}
