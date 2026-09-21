import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";

type ProductCardProps = {
  slug: string;
  title: string;
  price: number;
  brandName?: string;
  imageUrl?: string | null;
};

export function ProductCard({ slug, title, price, brandName, imageUrl }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      {imageUrl ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </div>
      ) : (
        <ProductPlaceholder className="aspect-[3/4] w-full transition-colors group-hover:bg-accent-soft" />
      )}
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