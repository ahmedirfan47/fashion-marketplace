import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";
import { SalesChart } from "@/components/seller/sales-chart";

export default async function SellerAnalyticsPage() {
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const since = new Date();
  since.setDate(since.getDate() - 14);

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("quantity, unit_price, orders(created_at)")
    .eq("brand_id", brand!.id)
    .gte("orders.created_at", since.toISOString());

  const dayTotals = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayTotals.set(d.toISOString().slice(0, 10), 0);
  }

  for (const row of orderItems ?? []) {
    const order = row.orders as unknown as { created_at: string } | null;
    if (!order) continue;
    const day = order.created_at.slice(0, 10);
    if (dayTotals.has(day)) {
      dayTotals.set(day, (dayTotals.get(day) ?? 0) + row.unit_price * row.quantity);
    }
  }

  const chartData = Array.from(dayTotals.entries()).map(([date, value]) => ({
    label: new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short" }),
    value,
  }));

  const { data: viewRows } = await supabase
    .from("product_views")
    .select("product_id")
    .eq("brand_id", brand!.id)
    .gte("created_at", since.toISOString());

  const viewCounts = new Map<string, number>();
  for (const row of viewRows ?? []) {
    viewCounts.set(row.product_id, (viewCounts.get(row.product_id) ?? 0) + 1);
  }

  const topProductIds = Array.from(viewCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  const { data: topProducts } = topProductIds.length
    ? await supabase.from("products").select("id, title").in("id", topProductIds)
    : { data: [] };

  const productTitleMap = new Map((topProducts ?? []).map((p) => [p.id, p.title]));
  const totalViews = viewRows?.length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-muted">Last 14 days.</p>
      </div>

      <SalesChart data={chartData} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-border p-6">
          <p className="text-xs uppercase tracking-wide text-muted">Product views</p>
          <p className="mt-2 font-display text-3xl text-ink">{totalViews}</p>
        </div>
        <div className="border border-border p-6">
          <p className="mb-3 text-xs uppercase tracking-wide text-muted">Most viewed products</p>
          {topProductIds.length > 0 ? (
            <div className="space-y-2">
              {topProductIds.map((id) => (
                <div key={id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{productTitleMap.get(id) ?? "Product"}</span>
                  <span className="text-muted">{viewCounts.get(id)} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No views yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}