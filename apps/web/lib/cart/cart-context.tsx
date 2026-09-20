"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CartItem } from "./types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "fashion-marketplace-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // corrupted or unavailable storage - start with an empty cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or unavailable - cart just will not persist
    }
  }, [items, hydrated]);

  function addItem(newItem: CartItem) {
    setItems((current) => {
      const existing = current.find((i) => i.variantId === newItem.variantId);
      if (existing) {
        return current.map((i) =>
          i.variantId === newItem.variantId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...current, newItem];
    });
  }

  function removeItem(variantId: string) {
    setItems((current) => current.filter((i) => i.variantId !== variantId));
  }

  function updateQuantity(variantId: string, quantity: number) {
    if (quantity < 1) {
      removeItem(variantId);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}