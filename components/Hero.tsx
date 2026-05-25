"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const PARTICLE_COUNT = 20;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: `${(i * 17 + 11) % 100}%`,
    y: `${(i * 23 + 7) % 100}%`,
    duration: 10 + (i % 10),
  }));
}

export default function Hero() {
  const particles = useMemo(() => createParticles(), []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-mesh">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
            initial={{ x: particle.x, y: particle.y }}
            animate={{
              y: [null, "-40px", "40px"],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.alphacoders.com/133/1338709.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/70" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent glow-text animate-float">
          BROOKS ANIME
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg"
        >
          Watch trending anime, explore seasonal releases, and experience cinematic streaming.
        </motion.p>

        <button className="mt-8 px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 transition-all glow flex items-center gap-2 mx-auto font-bold group">
          <Play className="fill-current group-hover:scale-110 transition-transform" />
          Start Watching
        </button>
      </motion.div>
    </section>
  );
}
