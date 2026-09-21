"use client";

import { useTransition } from "react";
import { updateFulfillmentStatus } from "@/lib/orders/fulfillment-actions";

const options = ["pending", "processing", "shipped", "delivered", "cancelled"];

export function FulfillmentSelect({ itemId, current }: { itemId: string; current: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateFulfillmentStatus(itemId, e.target.value))}
      className="border border-border bg-background px-2 py-1 text-xs text-ink focus:border-accent focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}