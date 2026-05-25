import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

export default function SectionHeader({ title, subtitle, action, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4 mb-6", className)}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className="text-sm text-zinc-500 mt-1 ml-4 pl-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
