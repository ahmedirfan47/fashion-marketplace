import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
        <div>
          <h1 className="font-display text-2xl text-ink">Products</h1>
          <p className="mt-1 text-sm text-muted">Manage what customers see in your shop.</p>
        </div>
        <LinkButton href="/seller/products/new">Add product</LinkButton>
      </div>

      {products && products.length > 0 ? (
        <div className="border border-border">
          <div className="hidden grid-cols-[1fr_120px_120px] gap-4 border-b border-border bg-surface px-5 py-3 text-xs uppercase tracking-wide text-muted sm:grid">
            <span>Product</span>
            <span>Status</span>
            <span className="text-right">Price</span>
          </div>
          <div className="divide-y divide-border">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/seller/products/${product.id}`}
                className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface sm:grid-cols-[1fr_120px_120px]"
              >
                <span className="text-sm text-ink">{product.title}</span>
                <Badge variant={product.status === "active" ? "accent" : "neutral"}>{product.status}</Badge>
                <span className="text-right text-sm text-ink">{formatPrice(product.base_price)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-sm text-muted">No products yet.</p>
          <div className="mt-4 flex justify-center">
            <LinkButton href="/seller/products/new" variant="secondary">Add your first product</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}