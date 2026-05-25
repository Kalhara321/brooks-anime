"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Bell, Sparkles } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { DEFAULT_AVATAR } from "@/lib/constants";
import SearchWithSuggestions from "@/components/SearchWithSuggestions";
import MobileNav from "@/components/MobileNav";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#trending", label: "Trending" },
  { href: "/#movies", label: "Movies" },
  { href: "/#series", label: "Series" },
  { href: "/#genres", label: "Genres" },
  { href: "/schedule", label: "Schedule" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="absolute inset-0 glass border-b border-violet-500/10 !rounded-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 h-[72px] flex items-center gap-3 md:gap-4">
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-pink-500 to-blue-600 flex items-center justify-center shadow-[0_0_24px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_32px_rgba(236,72,153,0.5)] transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-base md:text-lg font-black hidden sm:block">
              <span className="text-white">BROOKS</span>{" "}
              <span className="text-neon">ANIME</span>
            </span>
          </Link>

          <SearchWithSuggestions className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-auto" />

          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-violet-500/10 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              className="relative p-2.5 rounded-xl glass-hover text-zinc-400 hover:text-pink-400"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]" />
            </button>

            {session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-500/50 hover:ring-pink-500/60 transition-all"
                >
                  <Image
                    src={session.user.image || DEFAULT_AVATAR}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl py-2 z-50 border border-violet-500/20">
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-violet-500/10"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-violet-500/10"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-neon !py-2 !px-4 text-xs hidden sm:inline-flex">
                Sign In
              </Link>
            )}

            <button
              type="button"
              className="xl:hidden p-2.5 rounded-xl glass-hover"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
