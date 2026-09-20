"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";

type Variant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  stock_quantity: number;
  price_override: number | null;
};

type ProductActionsProps = {
  productSlug: string;
  productTitle: string;
  brandName?: string | null;
  basePrice: number;
  variants: Variant[];
};

export function ProductActions({
  productSlug,
  productTitle,
  brandName,
  basePrice,
  variants,
}: ProductActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = variants.find((v) => v.id === selectedId);
  const outOfStock = selected ? selected.stock_quantity === 0 : variants.length === 0;

  function handleAddToCart() {
    if (!selected || outOfStock) return;
    addItem({
      variantId: selected.id,
      productSlug,
      productTitle,
      brandName,
      size: selected.size,
      color: selected.color,
      unitPrice: selected.price_override ?? basePrice,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="space-y-6 border-t border-border pt-6">
      {variants.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs uppercase tracking-wide text-muted">Options</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = selectedId === variant.id;
              const isOut = variant.stock_quantity === 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedId(variant.id)}
                  disabled={isOut}
                  className={`border px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-accent bg-accent-soft text-accent-soft-ink"
                      : "border-border text-ink hover:border-accent"
                  } ${isOut ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {[variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <p className="text-xs uppercase tracking-wide text-muted">Qty</p>
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 text-ink transition-colors hover:text-accent"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-9 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 text-ink transition-colors hover:text-accent"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" size="lg" onClick={handleAddToCart} disabled={outOfStock} className="flex-1">
          {added ? "Added" : "Add to cart"}
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={handleBuyNow} disabled={outOfStock} className="flex-1">
          Buy now
        </Button>
      </div>
    </div>
  );
}