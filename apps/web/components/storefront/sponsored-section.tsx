import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/product-card";

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  brands: { name: string } | null;
  product_images: { url: string; position: number }[] | null;
};

function mainImage(images: { url: string; position: number }[] | null) {
  if (!images || images.length === 0) return null;
  return [...images].sort((a, b) => a.position - b.position)[0].url;
}

export async function SponsoredSection() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("ad_campaigns")
    .select("product_id")
    .eq("status", "approved")
    .lte("starts_at", new Date().toISOString().slice(0, 10))
    .gte("ends_at", new Date().toISOString().slice(0, 10));

  const productIds = Array.from(new Set((campaigns ?? []).map((c) => c.product_id)));
  if (productIds.length === 0) return null;

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, base_price, brands(name), product_images(url, position)")
    .in("id", productIds)
    .eq("status", "active");

  if (!products || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-7 font-display text-2xl text-ink">Sponsored</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {(products as unknown as ProductRow[]).map((product) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            title={product.title}
            price={product.base_price}
            brandName={product.brands?.name}
            imageUrl={mainImage(product.product_images)}
          />
        ))}
      </div>
    </section>
  );
}