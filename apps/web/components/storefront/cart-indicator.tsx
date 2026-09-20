"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export function CartIndicator() {
  const { itemCount } = useCart();
  return (
    <Link href="/cart" className="text-ink transition-colors hover:text-accent">
      Cart
      {itemCount > 0 && (
        <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[10px] font-medium text-accent-ink">
          {itemCount}
        </span>
      )}
    </Link>
  );
}