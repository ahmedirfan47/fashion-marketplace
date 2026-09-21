"use client";

import { useTransition, useOptimistic } from "react";
import { toggleFollow } from "@/lib/follows/actions";

export function FollowButton({ brandId, initialFollowed }: { brandId: string; initialFollowed: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [followed, setFollowed] = useOptimistic(initialFollowed, (_current, next: boolean) => next);

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={followed}
      onClick={() =>
        startTransition(async () => {
          setFollowed(!followed);
          await toggleFollow(brandId);
        })
      }
      className={`px-5 py-2 text-sm transition-colors ${
        followed
          ? "border border-accent bg-accent-soft text-accent-soft-ink"
          : "border border-border text-ink hover:border-accent"
      }`}
    >
      {followed ? "Following" : "Follow"}
    </button>
  );
}