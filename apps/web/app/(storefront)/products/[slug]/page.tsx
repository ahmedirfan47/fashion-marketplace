import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/storefront/product-actions";

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

  const brand = product.brands as unknown as { name: string; slug: string } | null;
  const variants = (product.product_variants ?? []) as unknown as Variant[];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 grid gap-12 md:grid-cols-2">
      <div className="aspect-[3/4] bg-surface border border-border" />

      <div className="space-y-6">
        {brand && (
          <p className="text-xs uppercase tracking-wide text-muted">{brand.name}</p>
        )}
        <h1 className="font-display text-3xl">{product.title}</h1>
        <p className="text-lg">{formatPrice(product.base_price)}</p>

        {product.description && (
          <p className="text-muted leading-relaxed">{product.description}</p>
        )}

        <ProductActions
          productSlug={slug}
          productTitle={product.title}
          brandName={brand?.name}
          basePrice={product.base_price}
          variants={variants}
        />
      </div>
    </main>
  );
}