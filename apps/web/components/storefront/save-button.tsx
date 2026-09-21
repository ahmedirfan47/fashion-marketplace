"use client";

import { useTransition, useOptimistic } from "react";
import { toggleWishlist } from "@/lib/wishlist/actions";

export function SaveButton({ productId, initialSaved }: { productId: string; initialSaved: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useOptimistic(initialSaved, (_current, next: boolean) => next);

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={saved}
      onClick={() =>
        startTransition(async () => {
          setSaved(!saved);
          await toggleWishlist(productId);
        })
      }
      className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm text-ink transition-colors hover:border-accent"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" strokeLinejoin="round" />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}