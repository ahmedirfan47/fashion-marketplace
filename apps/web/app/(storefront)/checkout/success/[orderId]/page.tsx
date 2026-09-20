import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

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
    <main className="mx-auto max-w-lg px-6 py-16 text-center space-y-4">
      <h1 className="font-display text-2xl">Order placed</h1>
      <p className="text-muted">
        Thank you - your order total is {formatPrice(order.total)}. We will contact you to confirm delivery.
      </p>
      <p className="text-xs text-muted">Order reference: {order.id}</p>
      <Link href="/" className="inline-block text-sm underline">
        Continue shopping
      </Link>
    </main>
  );
}