import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";

type ProductCardProps = {
  slug: string;
  title: string;
  price: number;
  brandName?: string;
};

export function ProductCard({ slug, title, price, brandName }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      <ProductPlaceholder className="aspect-[3/4] w-full transition-colors group-hover:bg-accent-soft" />
      <div className="mt-3 space-y-1">
        {brandName && (
          <p className="text-[11px] uppercase tracking-wide text-muted">{brandName}</p>
        )}
        <h3 className="text-sm text-ink transition-colors group-hover:text-accent">
          {title}
        </h3>
        <p className="text-sm text-muted">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}