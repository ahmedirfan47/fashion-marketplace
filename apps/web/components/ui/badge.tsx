import { cn } from "@/lib/utils";

const variants = {
  neutral: "bg-surface text-muted border border-border",
  accent: "bg-accent-soft text-accent-soft-ink",
  dark: "bg-surface-strong text-accent-ink",
} as const;

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 text-[11px] uppercase tracking-wide", variants[variant], className)}>
      {children}
    </span>
  );
}