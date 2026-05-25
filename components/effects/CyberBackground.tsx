"use client";

import { useMemo } from "react";

const PARTICLE_COUNT = 40;
const SAKURA_COUNT = 12;

export default function CyberBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 11) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        size: 2 + (i % 3),
        delay: `${(i % 10) * 0.4}s`,
        duration: `${6 + (i % 8)}s`,
        color:
          i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#3b82f6" : "#ec4899",
      })),
    []
  );

  const petals = useMemo(
    () =>
      Array.from({ length: SAKURA_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 8.3 + 5) % 100}%`,
        delay: `${i * 1.2}s`,
        duration: `${12 + (i % 6)}s`,
        size: 8 + (i % 4) * 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <div className="absolute inset-0 bg-[#020208]" />
      <div
        className="absolute inset-0 opacity-40 animate-gradient-bg"
        style={{
          background:
            "linear-gradient(-45deg, #020208, #0f0a1e, #0a1628, #1a0a14, #020208)",
        }}
      />
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/25 blur-[120px]"
        style={{ animation: "pulse-neon 8s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]"
        style={{ animation: "pulse-neon 10s ease-in-out infinite 2s" }}
      />
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-pink-600/15 blur-[90px]"
        style={{ animation: "pulse-neon 12s ease-in-out infinite 4s" }}
      />

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `float-particle ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {petals.map((p) => (
        <div
          key={`sakura-${p.id}`}
          className="absolute text-pink-400/40 animate-sakura"
          style={{
            left: p.left,
            fontSize: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        >
          ✦
        </div>
      ))}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
