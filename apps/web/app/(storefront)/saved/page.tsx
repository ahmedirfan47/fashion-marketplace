import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/product-card";
import { BrandCard } from "@/components/storefront/brand-card";

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

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: savedItems } = await supabase
    .from("wishlist_items")
    .select("products(id, title, slug, base_price, brands(name), product_images(url, position))")
    .eq("customer_id", user.id);

  const { data: followedBrands } = await supabase
    .from("brand_follows")
    .select("brands(id, name, slug)")
    .eq("customer_id", user.id);

  return (
    <main className="mx-auto max-w-6xl space-y-16 px-6 py-14">
      <div>
        <h1 className="font-display text-2xl text-ink">Saved items</h1>
        {savedItems && savedItems.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {savedItems.map((entry) => {
              const p = entry.products as unknown as ProductRow | null;
              if (!p) return null;
              return (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  price={p.base_price}
                  brandName={p.brands?.name}
                  imageUrl={mainImage(p.product_images)}
                />
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Nothing saved yet.</p>
        )}
      </div>

      <div>
        <h2 className="font-display text-2xl text-ink">Brands you follow</h2>
        {followedBrands && followedBrands.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {followedBrands.map((entry) => {
              const b = entry.brands as unknown as { id: string; name: string; slug: string } | null;
              if (!b) return null;
              return <BrandCard key={b.id} slug={b.slug} name={b.name} />;
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">You are not following any brands yet.</p>
        )}
      </div>
    </main>
  );
}