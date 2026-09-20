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

  const stats = [
    { label: "Products", value: String(productCount ?? 0) },
    { label: "Total sales", value: formatPrice(totalSales) },
    { label: "Commission owed", value: formatPrice(totalCommission) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Overview</h1>
        <p className="mt-1 text-sm text-muted">A snapshot of how your brand is performing.</p>
      </div>

      {brand!.status !== "active" && (
        <div className="border-l-4 border-accent bg-accent-soft px-5 py-4 text-sm text-accent-soft-ink">
          Your brand is currently <strong className="font-medium">{brand!.status}</strong>. Products will not be visible to customers until an admin approves your brand.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
            <p className="mt-2 font-display text-3xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}