export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <div
        className="ambient-orb w-[500px] h-[500px] -top-32 -right-32 bg-orange-500/30 animate-float-slow"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="ambient-orb w-[400px] h-[400px] top-1/2 -left-48 bg-violet-600/20 animate-float-slow"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="ambient-orb w-[300px] h-[300px] bottom-0 right-1/4 bg-amber-500/15 animate-float-slow"
        style={{ animationDelay: "-5s" }}
      />
    </div>
  );
}
