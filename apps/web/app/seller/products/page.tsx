import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";

export default async function SellerProductsPage() {
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, base_price, status")
    .eq("brand_id", brand!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <Link
          href="/seller/products/new"
          className="bg-accent text-accent-ink px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Add product
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="divide-y divide-border border-y border-border">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/seller/products/${product.id}`}
              className="flex items-center justify-between py-3 hover:bg-surface px-2 -mx-2"
            >
              <div>
                <p className="text-sm">{product.title}</p>
                <p className="text-xs text-muted uppercase tracking-wide">{product.status}</p>
              </div>
              <p className="text-sm">{formatPrice(product.base_price)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm">No products yet. Add your first one.</p>
      )}
    </div>
  );
}