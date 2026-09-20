import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { formatPrice } from "@/lib/utils";

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
      <h1 className="font-display text-2xl">Billing</h1>
      <p className="text-sm text-muted">
        Monthly commission invoices are generated automatically at the end of each period.
      </p>

      {payouts && payouts.length > 0 ? (
        <div className="divide-y divide-border border-y border-border">
          {payouts.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p>{payout.period_start} - {payout.period_end}</p>
                <p className="text-xs text-muted uppercase tracking-wide">{payout.status}</p>
              </div>
              <p>{formatPrice(payout.amount_due)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm">No invoices yet.</p>
      )}
    </div>
  );
}