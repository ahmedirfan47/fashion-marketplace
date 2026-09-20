import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";

export default async function SellerDashboardPage() {
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand!.id);

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("quantity, unit_price, commission_amount")
    .eq("brand_id", brand!.id);

  const totalSales = (orderItems ?? []).reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const totalCommission = (orderItems ?? []).reduce((sum, i) => sum + i.commission_amount, 0);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl">Overview</h1>

      {brand!.status !== "active" && (
        <p className="border border-border bg-surface px-4 py-3 text-sm">
          Your brand is currently <strong>{brand!.status}</strong>. Products will not be visible to customers until an admin approves your brand.
        </p>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Products</p>
          <p className="mt-1 text-2xl">{productCount ?? 0}</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Total sales</p>
          <p className="mt-1 text-2xl">{formatPrice(totalSales)}</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Commission owed</p>
          <p className="mt-1 text-2xl">{formatPrice(totalCommission)}</p>
        </div>
      </div>
    </div>
  );
}