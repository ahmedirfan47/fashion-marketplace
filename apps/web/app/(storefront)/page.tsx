import { createClient } from "@/lib/supabase/server";
import { BrandCard } from "@/components/storefront/brand-card";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";
import Link from "next/link";

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
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-20 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="mb-4 text-xs uppercase tracking-wide text-muted">New season</p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
            Independent fashion,
            <br />
            one address.
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Discover clothing and footwear from brands who make their own
            collections, sold directly, shipped from Pakistan.
          </p>
          <Link
            href="#new-arrivals"
            className="mt-8 inline-block border-b border-ink pb-1 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            Shop new arrivals
          </Link>
        </div>
        <ProductPlaceholder className="aspect-[4/5]" iconClassName="h-16 w-16" />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 font-display text-2xl">Brands</h2>
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

      <section id="new-arrivals" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24">
        <h2 className="mb-6 font-display text-2xl">New arrivals</h2>
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