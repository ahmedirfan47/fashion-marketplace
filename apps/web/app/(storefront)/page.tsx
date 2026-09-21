import { createClient } from "@/lib/supabase/server";
import { BrandCard } from "@/components/storefront/brand-card";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";
import { TrustBar } from "@/components/storefront/trust-bar";
import { LinkButton } from "@/components/ui/button";

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

export default async function StorefrontHome() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("status", "active")
    .limit(8);

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, base_price, brands(name), product_images(url, position)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-14 pb-16 md:grid-cols-[1.2fr_1fr] md:items-center md:pt-20 md:pb-20">
        <div>
          <p className="mb-5 inline-flex items-center bg-accent-soft px-3 py-1 text-[11px] uppercase tracking-wide text-accent-soft-ink">
            New season
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
            Independent fashion,
            <br />
            one address.
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Discover clothing and footwear from brands who make their own
            collections, sold directly, shipped from Pakistan.
          </p>
          <div className="mt-9">
            <LinkButton href="#new-arrivals" size="lg">
              Shop new arrivals
            </LinkButton>
          </div>
        </div>
        <ProductPlaceholder className="aspect-[4/5]" iconClassName="h-16 w-16" />
      </section>

      <TrustBar />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-7 font-display text-2xl text-ink">Brands</h2>
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

      <section id="new-arrivals" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
        <h2 className="mb-7 font-display text-2xl text-ink">New arrivals</h2>
        {products && products.length > 0 ? (
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
        ) : (
          <p className="text-muted">No active products yet.</p>
        )}
      </section>
    </main>
  );
}