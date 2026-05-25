import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiringSchedule from "@/components/AiringSchedule";
import CyberBackground from "@/components/effects/CyberBackground";

export default function SchedulePage() {
  return (
    <main className="relative min-h-screen">
      <CyberBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-[1400px] mx-auto px-4 pt-28 pb-16">
          <h1 className="font-display text-4xl font-black text-neon-purple mb-2">Schedule</h1>
          <p className="text-zinc-500 mb-10">Weekly airing calendar</p>
          <AiringSchedule />
        </div>
        <Footer />
      </div>
    </main>
  );
}
