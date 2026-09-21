import { createAdminClient } from "@/lib/supabase/admin";

type OrderItemRow = {
  brand_id: string;
  quantity: number;
  unit_price: number;
  commission_amount: number;
  orders: { created_at: string } | null;
};

export async function generatePayoutsForPeriod(periodStart: string, periodEnd: string) {
  const supabase = createAdminClient();

  const { data: items, error } = await supabase
    .from("order_items")
    .select("brand_id, quantity, unit_price, commission_amount, orders(created_at)")
    .gte("orders.created_at", periodStart)
    .lt("orders.created_at", periodEnd);

  if (error) {
    throw new Error(error.message);
  }

  const byBrand = new Map<string, { sales: number; commission: number }>();

  for (const row of (items ?? []) as unknown as OrderItemRow[]) {
    if (!row.orders) continue;
    const existing = byBrand.get(row.brand_id) ?? { sales: 0, commission: 0 };
    existing.sales += row.unit_price * row.quantity;
    existing.commission += row.commission_amount;
    byBrand.set(row.brand_id, existing);
  }

  let brandsProcessed = 0;

  for (const [brandId, totals] of byBrand.entries()) {
    const { error: upsertError } = await supabase.from("brand_payouts").upsert(
      {
        brand_id: brandId,
        period_start: periodStart,
        period_end: periodEnd,
        total_sales: totals.sales,
        total_commission: totals.commission,
        amount_due: totals.commission,
        status: "issued",
      },
      { onConflict: "brand_id,period_start,period_end" }
    );
    if (!upsertError) brandsProcessed++;
  }

  return { brandsProcessed, totalBrandsFound: byBrand.size };
}