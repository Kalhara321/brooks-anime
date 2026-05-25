import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Trophy, Clock, Heart, Bell, Sparkles, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberBackground from "@/components/effects/CyberBackground";
import { DEFAULT_AVATAR } from "@/lib/constants";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const stats = [
    { label: "Level", value: "24", icon: Trophy, color: "text-amber-400" },
    { label: "Episodes", value: "312", icon: Clock, color: "text-cyan-400" },
    { label: "Favorites", value: "48", icon: Heart, color: "text-pink-400" },
    { label: "Badges", value: "12", icon: Star, color: "text-violet-400" },
  ];

  const badges = ["🎬 Binge Master", "⭐ Critic", "🔥 Trendsetter", "💎 Collector"];

  return (
    <main className="relative min-h-screen">
      <CyberBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
          <section className="glass rounded-3xl p-8 border border-violet-500/20 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-violet-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                <Image src={session.user.image || DEFAULT_AVATAR} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1 flex items-center justify-center md:justify-start gap-1">
                  <Sparkles size={14} /> Premium Member
                </p>
                <h1 className="font-display text-3xl font-black text-neon-purple">{session.user.name}</h1>
                <p className="text-zinc-500 mt-1">{session.user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="glass rounded-xl p-4 text-center min-w-[90px]">
                    <s.icon className={`${s.color} mx-auto mb-1`} size={20} />
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="glass rounded-2xl p-6">
                <h2 className="section-heading mb-4">Watch History</h2>
                <p className="text-zinc-600 text-sm">Synced from your continue watching progress.</p>
              </section>
              <section className="glass rounded-2xl p-6">
                <h2 className="section-heading mb-4">Favorite Anime</h2>
                <p className="text-zinc-600 text-sm italic">Add favorites from any anime page.</p>
              </section>
            </div>
            <aside className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="section-heading mb-4 text-base">Achievements</h2>
                <div className="flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300 border border-violet-500/20"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center gap-2">
                  <Bell className="text-pink-400" size={18} />
                  <span className="font-bold text-sm">Notifications</span>
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border-b border-white/5 last:border-0 text-sm text-zinc-400">
                    New episode alert #{i}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
