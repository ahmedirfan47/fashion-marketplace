import { createClient } from "@/lib/supabase/server";
import { markOrderPaid } from "@/lib/admin/actions";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, status, payment_method, payment_status, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Orders</h1>
        <p className="mt-1 text-sm text-muted">Most recent 100 orders across the platform.</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {orders.map((order) => {
              const profile = order.profiles as unknown as { full_name: string | null } | null;
              const confirmPayment = markOrderPaid.bind(null, order.id);
              return (
                <div key={order.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-ink">#{order.id.slice(0, 8)} — {profile?.full_name ?? "Customer"}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {order.payment_method === "cod" ? "Cash on delivery" : "Bank transfer"} · {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={order.payment_status === "paid" ? "accent" : "neutral"}>{order.payment_status}</Badge>
                    {order.payment_method === "bank_transfer" && order.payment_status !== "paid" && (
                      <form action={confirmPayment}>
                        <Button type="submit" variant="secondary" size="sm">Confirm payment</Button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No orders yet.</p>
      )}
    </div>
  );
}