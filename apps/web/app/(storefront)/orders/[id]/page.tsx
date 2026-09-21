import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { requestReturn } from "@/lib/returns/actions";

type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
};

const statusVariant = (status: string) =>
  status === "delivered" || status === "paid" ? "accent" : "neutral";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, total, subtotal, discount_amount, payment_method, shipping_address, created_at")
    .eq("id", id)
    .eq("customer_id", user.id)
    .single();

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(
      "id, quantity, unit_price, fulfillment_status, product_variants(sku, size, color, products(title, slug, brands(name)))"
    )
    .eq("order_id", id);

  const itemIds = (items ?? []).map((i) => i.id);
  const { data: returns } = itemIds.length
    ? await supabase
        .from("return_requests")
        .select("id, order_item_id, status, refund_amount")
        .in("order_item_id", itemIds)
    : { data: [] };

  const returnByItem = new Map((returns ?? []).map((r) => [r.order_item_id, r]));
  const address = order.shipping_address as unknown as ShippingAddress | null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <Link href="/orders" className="text-xs text-muted hover:text-accent">
        ← Back to orders
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <h1 className="font-display text-2xl text-ink">Order #{order.id.slice(0, 8)}</h1>
        <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">
        Placed on{" "}
        {new Date(order.created_at).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_260px]">
        <div className="border border-border">
          <div className="divide-y divide-border">
            {(items ?? []).map((item) => {
              const variant = item.product_variants as unknown as {
                sku: string;
                size: string | null;
                color: string | null;
                products: { title: string; slug: string; brands: { name: string } | null } | null;
              } | null;
              const existingReturn = returnByItem.get(item.id);

              return (
                <div key={item.id} className="space-y-3 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      {variant?.products?.brands?.name && (
                        <p className="text-[11px] uppercase tracking-wide text-muted">
                          {variant.products.brands.name}
                        </p>
                      )}
                      {variant?.products ? (
                        <Link
                          href={`/products/${variant.products.slug}`}
                          className="text-sm text-ink hover:text-accent"
                        >
                          {variant.products.title}
                        </Link>
                      ) : (
                        <p className="text-sm text-ink">Product</p>
                      )}
                      <p className="mt-0.5 text-xs text-muted">
                        {[variant?.size, variant?.color].filter(Boolean).join(" / ")} · qty {item.quantity}
                      </p>
                      <Badge variant="neutral" className="mt-2">{item.fulfillment_status}</Badge>
                    </div>
                    <p className="text-sm text-ink">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>

                  {item.fulfillment_status === "delivered" && (
                    <>
                      {existingReturn ? (
                        <Badge variant={existingReturn.status === "refunded" ? "accent" : "neutral"}>
                          Return {existingReturn.status}
                        </Badge>
                      ) : (
                        <form action={requestReturn} className="space-y-2 border-t border-border pt-3">
                          <input type="hidden" name="orderItemId" value={item.id} />
                          <input type="hidden" name="orderId" value={order.id} />
                          <Textarea name="reason" placeholder="Reason for return" required rows={2} />
                          <Button type="submit" variant="secondary" size="sm">
                            Request return
                          </Button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-fit space-y-6">
          <div className="border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-muted">Payment</p>
            <p className="mt-2 text-sm text-ink">
              {order.payment_method === "cod" ? "Cash on delivery" : order.payment_method}
            </p>
            {order.discount_amount > 0 && (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted">Discount</span>
                <span className="text-accent">-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted">Total</span>
              <span className="text-ink">{formatPrice(order.total)}</span>
            </div>
          </div>

          {address && (
            <div className="border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-muted">Shipping to</p>
              <p className="mt-2 text-sm text-ink">{address.fullName}</p>
              <p className="text-sm text-muted">{address.addressLine}</p>
              <p className="text-sm text-muted">{address.city}</p>
              <p className="mt-1 text-sm text-muted">{address.phone}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}