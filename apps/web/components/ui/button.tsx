import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-colors";
const variants = {
  primary: "bg-accent text-accent-ink hover:opacity-90",
  secondary: "border border-border text-ink hover:bg-surface",
} as const;

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className,
  href,
  children,
  ...props
}: LinkProps & { variant?: Variant; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}