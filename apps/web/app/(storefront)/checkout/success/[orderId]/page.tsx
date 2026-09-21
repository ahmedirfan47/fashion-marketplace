import { notFound } from "next/navigation";
import Link from "next/link";
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
    .select("id, total, status, payment_method, created_at")
    .eq("id", orderId)
    .single();

  if (!order) {
    notFound();
  }

  const isBankTransfer = order.payment_method === "bank_transfer";

  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-accent-soft text-accent-soft-ink">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1 className="font-display text-2xl text-ink">Order placed</h1>
      <p className="mt-3 text-muted">
        Thank you — your order total is {formatPrice(order.total)}.
      </p>
      <p className="mt-2 text-xs text-muted">Order reference: {order.id}</p>

      {isBankTransfer && (
        <div className="mt-8 border border-border bg-surface p-6 text-left">
          <p className="text-sm font-medium text-ink">Bank transfer details</p>
          <p className="mt-3 text-sm text-muted">
            Bank: <span className="text-ink">{process.env.NEXT_PUBLIC_BANK_NAME || "To be confirmed"}</span>
          </p>
          <p className="text-sm text-muted">
            Account title: <span className="text-ink">{process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || "To be confirmed"}</span>
          </p>
          <p className="text-sm text-muted">
            Account number: <span className="text-ink">{process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "To be confirmed"}</span>
          </p>
          <p className="mt-3 text-xs text-muted">
            Please transfer the total amount and include your order reference. Your order will be confirmed once payment is received.
          </p>
        </div>
      )}

      <div className="mt-8">
        <LinkButton href="/">Continue shopping</LinkButton>
      </div>
    </main>
  );
}