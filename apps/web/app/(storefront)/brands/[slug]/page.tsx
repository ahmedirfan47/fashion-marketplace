import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/product-card";
import { FollowButton } from "@/components/storefront/follow-button";
import { isBrandFollowed } from "@/lib/follows/queries";

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  product_images: { url: string; position: number }[] | null;
};

function mainImage(images: { url: string; position: number }[] | null) {
  if (!images || images.length === 0) return null;
  return [...images].sort((a, b) => a.position - b.position)[0].url;
}

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
    .select("id, title, slug, base_price, product_images(url, position)")
    .eq("brand_id", brand.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const followed = user ? await isBrandFollowed(brand.id) : false;

  return (
    <main>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <nav className="mb-6 text-xs text-muted">
            <Link href="/" className="hover:text-accent">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{brand.name}</span>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl text-ink">{brand.name}</h1>
              {brand.description && (
                <p className="mt-3 max-w-xl text-muted">{brand.description}</p>
              )}
            </div>
            {user ? (
              <FollowButton brandId={brand.id} initialFollowed={followed} />
            ) : (
              <Link href="/login" className="text-sm text-muted underline underline-offset-2 hover:text-accent">
                Sign in to follow
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {(products as unknown as ProductRow[]).map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                title={product.title}
                price={product.base_price}
                imageUrl={mainImage(product.product_images)}
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