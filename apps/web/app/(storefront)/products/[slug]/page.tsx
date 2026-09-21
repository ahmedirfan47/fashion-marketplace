import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/storefront/product-actions";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";

type Variant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  stock_quantity: number;
  price_override: number | null;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, title, description, base_price, brands(name, slug), product_variants(id, sku, size, color, stock_quantity, price_override)"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) {
    notFound();
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("id, url")
    .eq("product_id", product.id)
    .order("position", { ascending: true });

  const brand = product.brands as unknown as { name: string; slug: string } | null;
  const variants = (product.product_variants ?? []) as unknown as Variant[];
  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-8 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-accent">Shop</Link>
        <span>/</span>
        {brand && (
          <>
            <Link href={`/brands/${brand.slug}`} className="hover:text-accent">{brand.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-3">
          {images && images.length > 0 ? (
            <>
              <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <Image src={images[0].url} alt={product.title} fill className="object-cover" priority />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(1).map((img) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden bg-surface">
                      <Image src={img.url} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <ProductPlaceholder className="aspect-[3/4]" iconClassName="h-14 w-14" />
          )}
        </div>

        <div className="space-y-6 md:max-w-md">
          <div>
            {brand && (
              <Link
                href={`/brands/${brand.slug}`}
                className="text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent"
              >
                {brand.name}
              </Link>
            )}
            <h1 className="mt-2 font-display text-3xl text-ink">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-lg text-ink">{formatPrice(product.base_price)}</p>
            <span
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wide ${
                totalStock > 0 ? "bg-accent-soft text-accent-soft-ink" : "bg-surface text-muted"
              }`}
            >
              {totalStock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>

          {product.description && (
            <p className="leading-relaxed text-muted">{product.description}</p>
          )}

          <ProductActions
            productSlug={slug}
            productTitle={product.title}
            brandName={brand?.name}
            basePrice={product.base_price}
            variants={variants}
          />
        </div>
      </div>
    </main>
  );
}