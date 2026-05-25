"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Source {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

interface VideoPlayerProps {
  /** Single direct URL (string) — legacy / fallback prop */
  url?: string;
  /** Array of quality sources from the streaming API */
  sources?: Source[];
  /** Anime title shown in the player header */
  title?: string;
  /** Current episode number */
  episodeNumber?: number;
  /** Total episodes (for prev/next navigation) */
  totalEpisodes?: number;
  /** Anime ID used to build prev/next hrefs */
  animeId?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const QUALITY_PRIORITY = ["1080p", "720p", "480p", "360p", "default", "auto"];

function pickBestSource(sources: Source[]): Source | null {
  if (!sources || sources.length === 0) return null;
  for (const q of QUALITY_PRIORITY) {
    const found = sources.find(
      (s) => (s.quality ?? "default").toLowerCase() === q
    );
    if (found) return found;
  }
  return sources[0];
}

/** Normalize incoming props into a unified sources array */
function normalizeSources(url?: string, sources?: Source[]): Source[] {
  if (sources && sources.length > 0) return sources;
  if (url) return [{ url, quality: "default" }];
  return [];
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function VideoPlayer({
  url,
  sources: sourcesProp,
  title = "Now Playing",
  episodeNumber = 1,
  totalEpisodes = 1,
  animeId,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Normalize sources once
  const allSources = normalizeSources(url, sourcesProp);
  const bestDefault = pickBestSource(allSources);

  const [currentSource, setCurrentSource] = useState<Source | null>(
    bestDefault
  );
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Re-sync when parent updates sources ─────────────────────────────────
  useEffect(() => {
    const updated = normalizeSources(url, sourcesProp);
    const best = pickBestSource(updated);
    if (best) {
      setCurrentSource(best);
      setError(null);
    }
  }, [url, sourcesProp]);

  // ── Sync video src ───────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSource?.url) return;

    const prevTime = video.currentTime;
    const wasPlaying = !video.paused;

    video.src = currentSource.url;
    video.load();

    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = prevTime;
        if (wasPlaying) video.play().catch(() => {});
      },
      { once: true }
    );
  }, [currentSource]);

  // ── Playback speed ───────────────────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // ── Controls auto-hide ───────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  // ── Event handlers ───────────────────────────────────────────────────────

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => setError("Playback blocked by browser."));
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleVolumeChange = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const handleSeek = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleQualityChange = (quality: string) => {
    const found = allSources.find(
      (s) => (s.quality ?? "default") === quality
    );
    if (found) setCurrentSource(found);
    setShowSettings(false);
  };

  // Navigation hrefs
  const prevHref =
    episodeNumber > 1 ? `/${animeId}?ep=${episodeNumber - 1}` : null;
  const nextHref =
    episodeNumber < totalEpisodes
      ? `/${animeId}?ep=${episodeNumber + 1}`
      : null;

  // ── No sources fallback ──────────────────────────────────────────────────
  if (allSources.length === 0) {
    return (
      <div className="w-full aspect-video bg-[#0a0a14] rounded-2xl flex flex-col items-center justify-center gap-4 border border-violet-500/20 text-white">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
          <Play size={28} className="text-violet-400 opacity-50 ml-1" />
        </div>
        <p className="text-zinc-400 text-sm font-medium">
          No video sources available for Episode {episodeNumber}
        </p>
        <p className="text-zinc-600 text-xs">
          The streaming source may be temporarily unavailable. Try another
          episode or check back later.
        </p>
        {prevHref && (
          <a
            href={prevHref}
            className="px-4 py-2 rounded-lg bg-violet-600/20 text-violet-300 text-sm hover:bg-violet-600/40 transition"
          >
            ← Try Previous Episode
          </a>
        )}
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={() => {
        togglePlay();
        resetHideTimer();
      }}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group select-none cursor-pointer"
      style={{ boxShadow: "0 0 60px rgba(139,92,246,0.25)" }}
    >
      {/* ── Video element ── */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (!v) return;
          setCurrentTime(v.currentTime);
          // buffered
          if (v.buffered.length > 0) {
            setBuffered(v.buffered.end(v.buffered.length - 1));
          }
        }}
        onLoadedMetadata={() => {
          const v = videoRef.current;
          if (v) setDuration(v.duration);
          setIsLoading(false);
        }}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setError(
            "Failed to load video. The source URL may have expired or is geo-restricted."
          );
          setIsLoading(false);
        }}
      />

      {/* ── Loading spinner ── */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
          <Loader2 size={48} className="text-violet-400 animate-spin" />
        </div>
      )}

      {/* ── Error overlay ── */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3 px-6 text-center">
          <p className="text-red-400 font-semibold">{error}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
              videoRef.current?.load();
            }}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Controls overlay ── */}
      <div
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.85) 100%)",
        }}
      >
        {/* Top bar */}
        <div className="px-4 pt-3 pointer-events-auto flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm line-clamp-1">
              {title}
            </p>
            <p className="text-zinc-400 text-xs">Episode {episodeNumber}</p>
          </div>
          {/* Settings button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings((p) => !p);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition text-zinc-300 hover:text-white"
            >
              <Settings size={18} />
            </button>
            {showSettings && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-10 bg-[#0f0f1a] border border-violet-500/30 rounded-xl p-3 min-w-[180px] z-50 shadow-xl"
              >
                {/* Quality */}
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">
                  Quality
                </p>
                {allSources.map((s, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handleQualityChange(s.quality ?? "default")
                    }
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-1 transition ${
                      currentSource?.url === s.url
                        ? "bg-violet-600 text-white"
                        : "text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {s.quality ?? "Default"}
                  </button>
                ))}

                {/* Speed */}
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2 mt-3">
                  Speed
                </p>
                {[0.5, 1, 1.25, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => {
                      setPlaybackSpeed(sp);
                      setShowSettings(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-1 transition ${
                      playbackSpeed === sp
                        ? "bg-violet-600 text-white"
                        : "text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {sp}x {sp === 1 ? "(Normal)" : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-4 pb-3 pointer-events-auto space-y-2">
          {/* Progress bar */}
          <div className="relative group/seek h-1 hover:h-2 transition-all duration-150 rounded-full bg-white/20 cursor-pointer">
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
              style={{
                width: duration ? `${(buffered / duration) * 100}%` : "0%",
              }}
            />
            {/* Played */}
            <div
              className="absolute inset-y-0 left-0 bg-violet-500 rounded-full"
              style={{
                width: duration
                  ? `${(currentTime / duration) * 100}%`
                  : "0%",
              }}
            />
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Buttons row */}
          <div className="flex items-center gap-3">
            {/* Prev episode */}
            {prevHref ? (
              <a
                href={prevHref}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-white/10 transition text-zinc-300 hover:text-white"
              >
                <ChevronLeft size={20} />
              </a>
            ) : (
              <button disabled className="p-1.5 text-zinc-700">
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Play/Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-2 rounded-full bg-violet-600 hover:bg-violet-500 transition text-white"
            >
              {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>

            {/* Next episode */}
            {nextHref ? (
              <a
                href={nextHref}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-white/10 transition text-zinc-300 hover:text-white"
              >
                <ChevronRight size={20} />
              </a>
            ) : (
              <button disabled className="p-1.5 text-zinc-700">
                <ChevronRight size={20} />
              </button>
            )}

            {/* Volume */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-zinc-300 hover:text-white"
            >
              {muted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="w-20 accent-violet-500 cursor-pointer"
            />

            {/* Time */}
            <span className="text-zinc-400 text-xs ml-1 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Fullscreen */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-zinc-300 hover:text-white"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Fullscreen listener ── */}
      <FullscreenListener onChanged={setIsFullscreen} />
    </div>
  );
}

// Tiny helper to track fullscreen state
function FullscreenListener({
  onChanged,
}: {
  onChanged: (v: boolean) => void;
}) {
  useEffect(() => {
    const handler = () => onChanged(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [onChanged]);
  return null;
}