"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";
import { ProductPlaceholder } from "@/components/ui/product-placeholder";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Nothing here yet — go find something you like.</p>
        <div className="mt-8">
          <LinkButton href="/">Continue shopping</LinkButton>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-8 font-display text-2xl text-ink">Your cart</h1>

      <div className="grid gap-10 md:grid-cols-[1fr_320px]">
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center gap-4 py-5">
              <ProductPlaceholder className="h-24 w-20 shrink-0" iconClassName="h-6 w-6" />
              <div className="flex-1">
                {item.brandName && (
                  <p className="text-[11px] uppercase tracking-wide text-muted">{item.brandName}</p>
                )}
                <Link href={`/products/${item.productSlug}`} className="text-sm text-ink hover:text-accent">
                  {item.productTitle}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {[item.size, item.color].filter(Boolean).join(" / ")}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="mt-2 text-xs text-muted underline-offset-2 hover:text-accent hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  className="h-8 w-8 text-ink hover:text-accent"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  className="h-8 w-8 text-ink hover:text-accent"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right text-sm text-ink">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="h-fit border border-border bg-surface p-6">
          <p className="text-sm font-medium text-ink">Order summary</p>
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span className="text-ink">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">Shipping calculated at checkout.</p>
          <LinkButton href="/checkout" className="mt-6 w-full">
            Proceed to checkout
          </LinkButton>
        </div>
      </div>
    </main>
  );
}