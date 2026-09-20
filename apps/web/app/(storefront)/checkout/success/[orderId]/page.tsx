import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("id", orderId)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-accent-soft text-accent-soft-ink">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1 className="font-display text-2xl text-ink">Order placed</h1>
      <p className="mt-3 text-muted">
        Thank you — your order total is {formatPrice(order.total)}. We will
        contact you to confirm delivery.
      </p>
      <p className="mt-2 text-xs text-muted">Order reference: {order.id}</p>
      <div className="mt-8">
        <LinkButton href="/">Continue shopping</LinkButton>
      </div>
    </main>
  );
}