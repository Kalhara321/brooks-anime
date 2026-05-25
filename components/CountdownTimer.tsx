"use client";

import { useState, useEffect } from "react";

type Props = {
  animeTitle: string;
  airingDate: string;
  episode: number;
};

function calculateTimeLeft(airingDate: string) {
  const now = Date.now();
  const airDate = new Date(airingDate).getTime();
  const difference = airDate - now;

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

export default function CountdownTimer({ animeTitle, airingDate, episode }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(airingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(airingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [airingDate]);

  if (!timeLeft) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-4 text-center">
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{animeTitle}</h3>
        <p className="text-green-400 text-xs">Episode {episode} is airing now!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-purple-900/20 rounded-xl p-4 border border-purple-500/20">
      <h3 className="font-semibold text-sm line-clamp-1 mb-2">{animeTitle}</h3>
      <p className="text-xs text-purple-400 mb-3">Episode {episode}</p>
      <div className="flex justify-center gap-2 text-center">
        <div className="bg-black/30 rounded-lg px-2 py-1 min-w-[44px]">
          <span className="text-xl font-bold text-purple-400">{timeLeft.days}</span>
          <p className="text-[10px] text-gray-400">Days</p>
        </div>
        <div className="bg-black/30 rounded-lg px-2 py-1 min-w-[44px]">
          <span className="text-xl font-bold text-purple-400">{timeLeft.hours}</span>
          <p className="text-[10px] text-gray-400">Hours</p>
        </div>
        <div className="bg-black/30 rounded-lg px-2 py-1 min-w-[44px]">
          <span className="text-xl font-bold text-purple-400">{timeLeft.minutes}</span>
          <p className="text-[10px] text-gray-400">Min</p>
        </div>
        <div className="bg-black/30 rounded-lg px-2 py-1 min-w-[44px]">
          <span className="text-xl font-bold text-purple-400 animate-pulse">{timeLeft.seconds}</span>
          <p className="text-[10px] text-gray-400">Sec</p>
        </div>
      </div>
    </div>
  );
}
