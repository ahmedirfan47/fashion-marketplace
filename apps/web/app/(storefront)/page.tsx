import { createClient } from "@/lib/supabase/server";
import { BrandCard } from "@/components/storefront/brand-card";
import { ProductCard } from "@/components/storefront/product-card";

export default async function StorefrontHome() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("status", "active")
    .limit(8);

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, base_price, brands(name)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      <section>
        <h1 className="font-display text-2xl mb-6">Brands</h1>
        {brands && brands.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} slug={brand.slug} name={brand.name} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No active brands yet.</p>
        )}
      </section>

      <section>
        <h1 className="font-display text-2xl mb-6">New arrivals</h1>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                title={product.title}
                price={product.base_price}
                brandName={(product.brands as unknown as { name: string } | null)?.name}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted">No active products yet.</p>
        )}
      </section>
    </main>
  );
}