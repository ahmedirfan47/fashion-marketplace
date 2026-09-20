"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { createOrder } from "@/lib/orders/actions";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const shippingAddress = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      addressLine: formData.get("addressLine") as string,
      city: formData.get("city") as string,
    };

    const result = await createOrder(
      items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      shippingAddress,
      "cod"
    );

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    clearCart();
    router.push(`/checkout/success/${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl mb-4">Your cart is empty</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-12 space-y-8">
      <h1 className="font-display text-2xl">Checkout</h1>

      {error && <p className="text-sm text-accent">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="addressLine">Address</label>
          <input
            id="addressLine"
            name="addressLine"
            type="text"
            required
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            required
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted">Total (Cash on delivery)</p>
          <p className="text-lg font-medium">{formatPrice(subtotal)}</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-accent-ink px-5 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </main>
  );
}