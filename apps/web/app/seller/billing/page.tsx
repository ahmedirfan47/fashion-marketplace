import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function SellerBillingPage() {
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { data: payouts } = await supabase
    .from("brand_payouts")
    .select("id, period_start, period_end, total_sales, total_commission, amount_due, status")
    .eq("brand_id", brand!.id)
    .order("period_start", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Billing</h1>
        <p className="mt-1 text-sm text-muted">
          Monthly commission invoices are generated automatically at the end of each period.
        </p>
      </div>

      {payouts && payouts.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm text-ink">{payout.period_start} — {payout.period_end}</p>
                  <p className="mt-0.5 text-xs text-muted">Sales: {formatPrice(payout.total_sales)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={payout.status === "paid" ? "accent" : "neutral"}>{payout.status}</Badge>
                  <p className="w-24 text-right text-sm text-ink">{formatPrice(payout.amount_due)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-sm text-muted">No invoices yet.</p>
        </div>
      )}
    </div>
  );
}