import { notFound } from "next/navigation";
import Link from "next/link";
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
    <main>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <nav className="mb-6 text-xs text-muted">
            <Link href="/" className="hover:text-accent">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{brand.name}</span>
          </nav>
          <h1 className="font-display text-4xl text-ink">{brand.name}</h1>
          {brand.description && (
            <p className="mt-3 max-w-xl text-muted">{brand.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </main>
  );
}