import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusVariant = (status: string) =>
  status === "delivered" || status === "paid" ? "accent" : "neutral";

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at, order_items(quantity)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-2xl text-ink">Your orders</h1>
      <p className="mt-1 text-sm text-muted">Everything you have bought on the marketplace.</p>

      {orders && orders.length > 0 ? (
        <div className="mt-8 border border-border">
          <div className="divide-y divide-border">
            {orders.map((order) => {
              const itemCount = (order.order_items ?? []).reduce(
                (sum: number, item: { quantity: number }) => sum + item.quantity,
                0
              );
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface"
                >
                  <div>
                    <p className="text-sm text-ink">
                      {new Date(order.created_at).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {itemCount} item{itemCount !== 1 ? "s" : ""} · #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                    <p className="w-24 text-right text-sm text-ink">{formatPrice(order.total)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-sm text-muted">You have not placed any orders yet.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-ink underline underline-offset-2 hover:text-accent">
            Start shopping
          </Link>
        </div>
      )}
    </main>
  );
}