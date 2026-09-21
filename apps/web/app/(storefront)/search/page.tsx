import Link from "next/link";
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

function buildQuery(params: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const merged = { ...params, ...overrides };
  const qs = Object.entries(merged)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return `/search${qs ? `?${qs}` : ""}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id, title, slug, base_price, brands(name), product_images(url, position)")
    .eq("status", "active");

  if (q) query = query.textSearch("search_vector", q, { type: "websearch", config: "english" });
  if (category) query = query.eq("category", category);

  if (sort === "price_asc") query = query.order("base_price", { ascending: true });
  else if (sort === "price_desc") query = query.order("base_price", { ascending: false });
  else if (!q) query = query.order("created_at", { ascending: false });

  const { data: products } = await query;

  const { data: categoryRows } = await supabase
    .from("products")
    .select("category")
    .eq("status", "active");

  const categories = Array.from(new Set((categoryRows ?? []).map((r) => r.category))).sort();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-2xl text-ink">
        {q ? `Results for "${q}"` : "All products"}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href={buildQuery({ q, sort }, { category: undefined })}
          className={`border px-3 py-1.5 text-xs uppercase tracking-wide ${
            !category ? "border-accent bg-accent-soft text-accent-soft-ink" : "border-border text-muted hover:border-accent"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={buildQuery({ q, sort }, { category: c })}
            className={`border px-3 py-1.5 text-xs uppercase tracking-wide ${
              category === c ? "border-accent bg-accent-soft text-accent-soft-ink" : "border-border text-muted hover:border-accent"
            }`}
          >
            {c}
          </Link>
        ))}

        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-muted">Sort</span>
          <Link href={buildQuery({ q, category }, { sort: undefined })} className={!sort ? "text-accent" : "text-muted hover:text-accent"}>
            {q ? "Relevance" : "Newest"}
          </Link>
          <Link href={buildQuery({ q, category }, { sort: "price_asc" })} className={sort === "price_asc" ? "text-accent" : "text-muted hover:text-accent"}>
            Price ↑
          </Link>
          <Link href={buildQuery({ q, category }, { sort: "price_desc" })} className={sort === "price_desc" ? "text-accent" : "text-muted hover:text-accent"}>
            Price ↓
          </Link>
        </div>
      </div>

      <div className="mt-8">
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
          <p className="text-muted">No products match your search.</p>
        )}
      </div>
    </main>
  );
}