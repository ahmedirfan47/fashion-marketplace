import Link from "next/link";

type BrandCardProps = {
  slug: string;
  name: string;
};

export function BrandCard({ slug, name }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${slug}`}
      className="flex aspect-square items-center justify-center border border-border bg-surface px-4 text-center text-sm text-ink transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
    >
      {name}
    </Link>
  );
}