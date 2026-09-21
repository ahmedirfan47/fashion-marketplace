import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { resolveReturn } from "@/lib/returns/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default async function SellerReturnsPage() {
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { data: returns } = await supabase
    .from("return_requests")
    .select(
      "id, reason, status, refund_amount, requested_at, order_items(unit_price, quantity, product_variants(products(title)))"
    )
    .eq("brand_id", brand!.id)
    .order("requested_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Returns</h1>
        <p className="mt-1 text-sm text-muted">Customer return and refund requests.</p>
      </div>

      {returns && returns.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {returns.map((r) => {
              const item = r.order_items as unknown as {
                unit_price: number;
                quantity: number;
                product_variants: { products: { title: string } | null } | null;
              } | null;
              const title = item?.product_variants?.products?.title ?? "Product";
              const lineTotal = item ? item.unit_price * item.quantity : 0;
              const approve = resolveReturn.bind(null, r.id, "approved", lineTotal);
              const reject = resolveReturn.bind(null, r.id, "rejected", undefined);
              const markRefunded = resolveReturn.bind(null, r.id, "refunded", r.refund_amount ?? lineTotal);

              return (
                <div key={r.id} className="space-y-2 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink">{title}</p>
                    <Badge variant={r.status === "refunded" ? "accent" : "neutral"}>{r.status}</Badge>
                  </div>
                  <p className="text-xs text-muted">Reason: {r.reason}</p>
                  <p className="text-xs text-muted">Order value: {formatPrice(lineTotal)}</p>

                  {r.status === "requested" && (
                    <div className="flex gap-3 pt-1">
                      <form action={approve}>
                        <Button type="submit" variant="secondary" size="sm">Approve</Button>
                      </form>
                      <form action={reject}>
                        <Button type="submit" variant="secondary" size="sm">Reject</Button>
                      </form>
                    </div>
                  )}
                  {r.status === "approved" && (
                    <form action={markRefunded} className="pt-1">
                      <Button type="submit" variant="secondary" size="sm">Mark refunded</Button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-sm text-muted">No return requests yet.</p>
        </div>
      )}
    </div>
  );
}