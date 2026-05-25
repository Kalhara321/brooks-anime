"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import CyberBackground from "@/components/effects/CyberBackground";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      <CyberBackground />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-48 rounded-xl opacity-20 blur-sm rotate-12 bg-gradient-to-b from-violet-600 to-pink-600" />
        <div className="absolute bottom-20 right-10 w-40 h-56 rounded-xl opacity-15 blur-sm -rotate-6 bg-gradient-to-b from-blue-600 to-cyan-600" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-[0_0_32px_rgba(168,85,247,0.5)]">
            <Sparkles className="text-white" />
          </div>
          <span className="font-display text-2xl font-black text-neon">BROOKS ANIME</span>
        </Link>

        <div className="glass rounded-3xl p-8 border border-violet-500/20 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
          <h1 className="font-display text-xl font-bold text-center text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-500 text-center mb-8">
            Sign in to sync watch history, favorites, and recommendations
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl glass glass-hover font-semibold text-sm"
            >
              <Image src="https://www.google.com/favicon.ico" alt="" width={20} height={20} />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 hover:bg-[#5865F2]/30 font-semibold text-sm text-[#aeb4ff] transition-colors"
            >
              <span className="text-lg">💬</span>
              Continue with Discord
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-zinc-500">Or</span></div>
            </div>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-semibold text-sm text-zinc-300"
            >
              Continue as Guest
            </Link>
          </div>

          <div className="hologram-line my-6" />
          <p className="text-xs text-zinc-600 text-center">
            By signing in you agree to our terms. Discord OAuth requires provider setup.
          </p>
        </div>
      </div>
    </main>
  );
}
