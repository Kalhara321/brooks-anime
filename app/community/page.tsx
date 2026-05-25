import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberBackground from "@/components/effects/CyberBackground";
import Comments from "@/components/Comments";
import { MessageSquare, TrendingUp, Users, PartyPopper } from "lucide-react";

const trendingPosts = [
  { title: "Best anime of 2025 so far?", replies: 234, emoji: "🔥" },
  { title: "Frieren episode discussion — no spoilers", replies: 189, emoji: "✨" },
  { title: "Underrated gems you need to watch", replies: 156, emoji: "💎" },
];

export default function CommunityPage() {
  return (
    <main className="relative min-h-screen">
      <CyberBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-[1400px] mx-auto px-4 pt-28 pb-16">
          <h1 className="font-display text-4xl font-black text-neon-purple mb-2">
            Community
          </h1>
          <p className="text-zinc-500 mb-10">Discuss, review, and connect with fellow fans</p>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              { icon: MessageSquare, label: "Forums", desc: "Deep discussions" },
              { icon: TrendingUp, label: "Trending", desc: "Hot topics today" },
              { icon: PartyPopper, label: "Watch Party", desc: "Watch together" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="glass glass-hover rounded-2xl p-6 text-center">
                <Icon className="w-10 h-10 text-violet-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-white">{label}</h3>
                <p className="text-sm text-zinc-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-6">
              <h2 className="section-heading mb-6 flex items-center gap-2">
                <Users size={20} className="text-pink-400" />
                Trending Posts
              </h2>
              <ul className="space-y-4">
                {trendingPosts.map((post) => (
                  <li
                    key={post.title}
                    className="flex items-start gap-3 p-4 rounded-xl hover:bg-violet-500/10 transition-colors cursor-pointer border border-transparent hover:border-violet-500/20"
                  >
                    <span className="text-2xl">{post.emoji}</span>
                    <div>
                      <p className="font-medium text-zinc-200">{post.title}</p>
                      <p className="text-xs text-zinc-600 mt-1">{post.replies} replies</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="section-heading mb-6">Live Discussion</h2>
              <Comments animeId={21} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
