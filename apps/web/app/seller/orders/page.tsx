import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function SellerOrdersPage() {
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select(
      "id, quantity, unit_price, commission_amount, created_at, orders(id, status), product_variants(sku, size, color, products(title))"
    )
    .eq("brand_id", brand!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Orders</h1>
        <p className="mt-1 text-sm text-muted">Every order line that includes your products.</p>
      </div>

      {orderItems && orderItems.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {orderItems.map((item) => {
              const order = item.orders as unknown as { id: string; status: string } | null;
              const variant = item.product_variants as unknown as {
                sku: string;
                size: string | null;
                color: string | null;
                products: { title: string } | null;
              } | null;

              return (
                <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm text-ink">{variant?.products?.title ?? "Product"}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {[variant?.size, variant?.color].filter(Boolean).join(" / ")} · qty {item.quantity}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      Commission: {formatPrice(item.commission_amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="neutral">{order?.status}</Badge>
                    <p className="w-24 text-right text-sm text-ink">
                      {formatPrice(item.unit_price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-sm text-muted">No orders yet.</p>
        </div>
      )}
    </div>
  );
}