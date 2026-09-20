import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  slug: string;
  title: string;
  price: number;
  brandName?: string;
};

export function ProductCard({ slug, title, price, brandName }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="aspect-[3/4] w-full bg-surface border border-border" />
      <div className="mt-3 space-y-1">
        {brandName && (
          <p className="text-xs uppercase tracking-wide text-muted">{brandName}</p>
        )}
        <h3 className="text-sm text-ink group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}