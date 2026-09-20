"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl mb-4">Your cart is empty</h1>
        <Link href="/" className="text-sm underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <h1 className="font-display text-2xl">Your cart</h1>

      <div className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-center gap-4 py-4">
            <div className="h-20 w-16 shrink-0 bg-surface border border-border" />
            <div className="flex-1">
              {item.brandName && (
                <p className="text-xs uppercase tracking-wide text-muted">{item.brandName}</p>
              )}
              <Link href={`/products/${item.productSlug}`} className="text-sm hover:text-accent">
                {item.productTitle}
              </Link>
              <p className="text-xs text-muted">
                {[item.size, item.color].filter(Boolean).join(" / ")}
              </p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.variantId, Number(e.target.value))}
              className="w-16 border border-border px-2 py-1.5 text-sm"
            />
            <p className="w-24 text-right text-sm">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.variantId)}
              className="text-xs text-muted hover:text-accent"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Subtotal</p>
        <p className="text-lg font-medium">{formatPrice(subtotal)}</p>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-accent text-accent-ink text-center px-5 py-3 text-sm font-medium hover:opacity-90"
      >
        Proceed to checkout
      </Link>
    </main>
  );
}