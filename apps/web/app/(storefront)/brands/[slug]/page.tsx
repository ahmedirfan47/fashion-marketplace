import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/product-card";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!brand) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, base_price")
    .eq("brand_id", brand.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-10">
      <div>
        <h1 className="font-display text-3xl">{brand.name}</h1>
        {brand.description && (
          <p className="mt-2 text-muted max-w-xl">{brand.description}</p>
        )}
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              title={product.title}
              price={product.base_price}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted">No products from this brand yet.</p>
      )}
    </main>
  );
}