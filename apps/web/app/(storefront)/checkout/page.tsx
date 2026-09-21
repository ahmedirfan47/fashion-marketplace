"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { createOrder, previewDiscount } from "@/lib/orders/actions";
import { formatPrice } from "@/lib/utils";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");

  async function handleApplyCode() {
    setCheckingCode(true);
    setDiscountMessage(null);
    const result = await previewDiscount(discountCode, subtotal);
    setCheckingCode(false);
    if (!result.valid) {
      setDiscountAmount(0);
      setDiscountMessage(result.message);
      return;
    }
    setDiscountAmount(result.discountAmount);
    setDiscountMessage(result.message);
  }

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
      paymentMethod,
      discountCode || undefined
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
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
      </main>
    );
  }

  const total = Math.max(0, subtotal - discountAmount);

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-8 font-display text-2xl text-ink">Checkout</h1>

      <div className="grid gap-10 md:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-accent">{error}</p>}

          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" type="text" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div>
            <Label htmlFor="addressLine">Address</Label>
            <Input id="addressLine" name="addressLine" type="text" required />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" type="text" required />
          </div>

          <div>
            <Label>Payment method</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 border border-border px-4 py-3 text-sm">
                <input
                  type="radio"
                  name="paymentMethodRadio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on delivery
              </label>
              <label className="flex items-center gap-3 border border-border px-4 py-3 text-sm">
                <input
                  type="radio"
                  name="paymentMethodRadio"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                />
                Bank transfer
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Placing order..." : "Place order"}
          </Button>
        </form>

        <div className="h-fit space-y-4 border border-border bg-surface p-6">
          <p className="text-sm font-medium text-ink">Order summary</p>

          <div className="flex gap-2">
            <Input
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleApplyCode} disabled={checkingCode || !discountCode}>
              Apply
            </Button>
          </div>
          {discountMessage && (
            <p className={`text-xs ${discountAmount > 0 ? "text-accent" : "text-muted"}`}>{discountMessage}</p>
          )}

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between text-muted">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-muted">
                <span>Discount</span>
                <span className="text-accent">-{formatPrice(discountAmount)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted">Total</span>
            <span className="text-base text-ink">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}