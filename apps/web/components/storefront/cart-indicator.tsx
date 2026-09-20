"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export function CartIndicator() {
  const { itemCount } = useCart();
  return (
    <Link href="/cart" className="hover:text-accent transition-colors">
      Cart{itemCount > 0 ? ` (${itemCount})` : ""}
    </Link>
  );
}