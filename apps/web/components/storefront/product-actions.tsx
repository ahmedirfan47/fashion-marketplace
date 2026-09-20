"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";

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
    <div className="space-y-4">
      {variants.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Options</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedId(variant.id)}
                disabled={variant.stock_quantity === 0}
                className={`border px-3 py-1.5 text-sm transition-colors ${
                  selectedId === variant.id
                    ? "border-accent text-accent"
                    : "border-border text-ink hover:border-accent"
                } ${variant.stock_quantity === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {[variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku}
                {variant.stock_quantity === 0 && " (out of stock)"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm">Qty</label>
        <input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-16 border border-border px-2 py-1.5 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex-1 border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {added ? "Added" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex-1 bg-accent text-accent-ink px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}