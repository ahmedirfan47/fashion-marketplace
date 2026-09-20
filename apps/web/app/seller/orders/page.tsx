import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";

export default async function SellerOrdersPage() {
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select(
      "id, quantity, unit_price, commission_amount, created_at, orders(id, status, created_at), product_variants(sku, size, color, products(title))"
    )
    .eq("brand_id", brand!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">Orders</h1>

      {orderItems && orderItems.length > 0 ? (
        <div className="divide-y divide-border border-y border-border">
          {orderItems.map((item) => {
            const order = item.orders as unknown as { id: string; status: string } | null;
            const variant = item.product_variants as unknown as {
              sku: string;
              size: string | null;
              color: string | null;
              products: { title: string } | null;
            } | null;

            return (
              <div key={item.id} className="py-3 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <p>{variant?.products?.title ?? "Product"}</p>
                  <p>{formatPrice(item.unit_price * item.quantity)}</p>
                </div>
                <p className="text-xs text-muted">
                  {[variant?.size, variant?.color].filter(Boolean).join(" / ")} - qty {item.quantity} - status {order?.status}
                </p>
                <p className="text-xs text-muted">
                  Commission on this line: {formatPrice(item.commission_amount)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted text-sm">No orders yet.</p>
      )}
    </div>
  );
}