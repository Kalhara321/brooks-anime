import { cn } from "@/lib/utils";

type BadgeVariant = "sub" | "dub" | "tv" | "ongoing" | "hd" | "default";

const styles: Record<BadgeVariant, string> = {
  sub: "bg-emerald-500/90 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]",
  dub: "bg-rose-500/90 text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]",
  tv: "bg-zinc-800/90 text-zinc-200 border border-white/10",
  ongoing: "bg-orange-500/90 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]",
  hd: "bg-amber-500/90 text-black font-extrabold",
  default: "bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-sm",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
