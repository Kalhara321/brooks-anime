import Link from "next/link";
import { Sparkles, MessageCircle, Share2, Users } from "lucide-react";

const links = {
  Explore: [
    { href: "/", label: "Home" },
    { href: "/#trending", label: "Trending" },
    { href: "/schedule", label: "Schedule" },
    { href: "/community", label: "Community" },
  ],
  Legal: [
    { href: "/news", label: "News" },
    { href: "/profile", label: "Account" },
    { href: "/login", label: "Sign In" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative mt-16">
      <div className="hologram-line max-w-[1400px] mx-auto mb-0" />
      <div className="glass border-t border-violet-500/10 !rounded-none mt-0">
        <div className="max-w-[1400px] mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display text-lg font-black">
                  <span className="text-white">BROOKS</span>{" "}
                  <span className="text-neon">ANIME</span>
                </span>
              </div>
              <p className="text-sm text-zinc-500 max-w-sm leading-relaxed mb-6">
                Next-generation anime streaming. Cinematic, immersive, and built for fans who
                demand the best.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: MessageCircle, label: "Discord", href: "#" },
                  { icon: Share2, label: "Share", href: "#" },
                  { icon: Users, label: "Community", href: "/community" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center text-zinc-400 hover:text-pink-400"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
                  {title}
                </p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="hologram-line my-8" />
          <p className="text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} Brooks Anime. All anime data via Jikan API. For
            demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
