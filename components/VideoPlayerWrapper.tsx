// components/VideoPlayerWrapper.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import EpisodeList from './EpisodeList';

type Props = {
  animeId: string;
  animeTitle: string;
  episodeNumber: number;
  totalEpisodes: number;
};

export default function VideoPlayerWrapper({
  animeId,
  animeTitle,
  episodeNumber,
  totalEpisodes,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentEp, setCurrentEp] = useState(episodeNumber);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [episodesData, setEpisodesData] = useState<any>(null);

  // Fetch real episodes from Consumet
  useEffect(() => {
    const fetchEpisodes = async () => {
      const data = await fetch(`/api/episodes?title=${encodeURIComponent(animeTitle)}`).then(r => r.json());
      setEpisodesData(data);
    };
    fetchEpisodes();
  }, [animeTitle]);

  const loadEpisode = async (epNumber: number) => {
    setLoading(true);
    const episodeList = episodesData?.episodes || [];
    const episode = episodeList.find((e: any) => e.number === epNumber) || episodeList[epNumber - 1];

    if (!episode?.id) {
      alert("Episode not found");
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/sources?episodeId=${episode.id}`);
    const data = await res.json();

    setSources(data.sources || []);
    setCurrentEp(epNumber);

    // Play video
    const video = videoRef.current;
    if (!video || !data.sources?.length) {
      setLoading(false);
      return;
    }

    const sourceUrl = data.sources[0].url;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      video.play();
    }
    setLoading(false);
  };

  // Load first episode on mount
  useEffect(() => {
    if (episodesData?.episodes?.length) {
      loadEpisode(currentEp);
    }
  }, [episodesData]);

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden ring-1 ring-violet-500/30">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <p className="text-xl">Loading episode...</p>
          </div>
        )}
        <video ref={videoRef} controls className="w-full h-full" />
      </div>

      {/* Episode List */}
      <EpisodeList
        episodes={episodesData?.episodes || []}
        currentEpisode={currentEp}
        onEpisodeChange={loadEpisode}
        totalEpisodes={totalEpisodes}
      />
    </div>
  );
}