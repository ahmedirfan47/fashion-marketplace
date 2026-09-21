import { submitReview } from "@/lib/reviews/actions";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function ReviewsSection({
  productId,
  reviews,
  eligibleOrderItemId,
  isSignedIn,
}: {
  productId: string;
  reviews: Review[];
  eligibleOrderItemId: string | null;
  isSignedIn: boolean;
}) {
  const slug = typeof window === "undefined" ? "" : "";
  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mt-20 max-w-2xl border-t border-border pt-10">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl text-ink">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Stars rating={Math.round(average)} />
            <span>({reviews.length})</span>
          </div>
        )}
      </div>

      {eligibleOrderItemId && (
        <form action={submitReview} className="mt-6 space-y-3 border border-border bg-surface p-5">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="orderItemId" value={eligibleOrderItemId} />
          <p className="text-sm font-medium text-ink">Leave a review</p>
          <select
            name="rating"
            defaultValue="5"
            className="border border-border bg-background px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <Textarea name="comment" placeholder="Optional comment" rows={3} />
          <Button type="submit" variant="secondary" size="sm">Submit review</Button>
        </form>
      )}

      {!isSignedIn && (
        <p className="mt-6 text-sm text-muted">Sign in and purchase this item to leave a review.</p>
      )}

      <div className="mt-8 space-y-6">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-border pb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink">{r.profiles?.full_name ?? "Customer"}</p>
                <Stars rating={r.rating} />
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted">{r.comment}</p>}
              <p className="mt-2 text-xs text-muted">
                {new Date(r.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No reviews yet.</p>
        )}
      </div>
    </section>
  );
}