import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function StorefrontHome() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .eq("status", "active")
    .limit(8);

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, base_price, brand_id, brands(name, slug)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Brands</h1>
      {brands && brands.length > 0 ? (
        <ul style={{ display: "flex", gap: "1rem", listStyle: "none", padding: 0 }}>
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link href={`/brands/${brand.slug}`}>{brand.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active brands yet.</p>
      )}

      <h1 style={{ fontSize: "1.5rem", margin: "2rem 0 1rem" }}>Products</h1>
      {products && products.length > 0 ? (
        <ul style={{ display: "grid", gap: "1rem", listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.slug}`}>
                {product.title} — Rs {product.base_price}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active products yet.</p>
      )}
    </main>
  );
}
