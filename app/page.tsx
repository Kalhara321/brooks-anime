import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberBackground from "@/components/effects/CyberBackground";
import FeaturedHero from "@/components/FeaturedHero";
import ContinueWatching from "@/components/ContinueWatching";
import AnimeRow from "@/components/home/AnimeRow";
import SeasonPicker from "@/components/home/SeasonPicker";
import GenreGrid from "@/components/home/GenreGrid";
import AISection from "@/components/home/AISection";
import ScheduleStrip from "@/components/home/ScheduleStrip";
import {
  getTrendingAnime,
  getSeasonNow,
  getTopAnimeByFilter,
} from "@/lib/api";
import { splitAnimeLists } from "@/lib/anime-utils";

export default async function Home() {
  const [trending, seasonal, popular] = await Promise.all([
    getTrendingAnime(),
    getSeasonNow(),
    getTopAnimeByFilter("bypopularity"),
  ]);

  const topRated = [...trending].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const { newReleases, upcoming } = splitAnimeLists(trending.length ? trending : popular);

  return (
    <main className="relative min-h-screen">
      <CyberBackground />
      <div className="relative z-10">
        <Navbar />
        <FeaturedHero anime={trending.length ? trending : popular} />

        <div className="max-w-[1400px] mx-auto px-4 py-10 md:py-12">
          <ContinueWatching />

          <div id="trending">
            <AnimeRow
              title="Trending Now"
              subtitle="What everyone is watching"
              anime={trending}
              href="/#trending"
            />
          </div>

          <SeasonPicker seasonal={seasonal} fallback={trending} />

          <AnimeRow
            title="Popular Today"
            subtitle="Most popular on MyAnimeList"
            anime={popular}
          />

          <div id="series">
            <AnimeRow
              title="Top Rated"
              subtitle="Highest scores of all time"
              anime={topRated}
            />
          </div>

          <AnimeRow
            title="Recently Added"
            subtitle="Fresh titles to explore"
            anime={newReleases}
          />

          <AnimeRow title="Upcoming" subtitle="Coming soon" anime={upcoming} />

          <div id="movies">
            <AnimeRow
              title="Movies & Features"
              subtitle="Feature-length anime"
              anime={trending.filter((a) => a.type === "Movie").length ? trending.filter((a) => a.type === "Movie") : trending.slice(10, 20)}
            />
          </div>

          <AISection />

          <div id="genres">
            <GenreGrid />
          </div>

          <ScheduleStrip />
        </div>

        <Footer />
      </div>
    </main>
  );
}
