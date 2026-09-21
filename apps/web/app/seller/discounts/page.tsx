import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { createDiscount, toggleDiscount, deleteDiscount } from "@/lib/discounts/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SellerDiscountsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { data: discounts } = await supabase
    .from("discounts")
    .select("id, code, discount_type, value, active, starts_at, ends_at")
    .eq("brand_id", brand!.id)
    .order("code", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Discounts</h1>
        <p className="mt-1 text-sm text-muted">Codes customers can apply at checkout.</p>
      </div>

      {saved && <p className="text-sm text-accent">Discount created.</p>}
      {error && <p className="text-sm text-accent">{decodeURIComponent(error)}</p>}

      {discounts && discounts.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {discounts.map((d) => {
              const setActive = toggleDiscount.bind(null, d.id, !d.active);
              const remove = deleteDiscount.bind(null, d.id);
              return (
                <div key={d.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-ink">{d.code}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {d.discount_type === "percentage" ? `${d.value}% off` : `Rs ${d.value} off`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={d.active ? "accent" : "neutral"}>{d.active ? "Active" : "Inactive"}</Badge>
                    <form action={setActive}>
                      <button type="submit" className="text-xs text-muted hover:text-accent">
                        {d.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                    <form action={remove}>
                      <button type="submit" className="text-xs text-muted hover:text-accent">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No discount codes yet.</p>
      )}

      <form action={createDiscount} className="space-y-4 border border-border bg-surface p-6">
        <p className="text-sm font-medium text-ink">Create a discount code</p>
        <div>
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" type="text" required placeholder="e.g. WELCOME10" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discountType">Type</Label>
            <select
              id="discountType"
              name="discountType"
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount (PKR)</option>
            </select>
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input id="value" name="value" type="number" min="0" step="0.01" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startsAt">Starts (optional)</Label>
            <Input id="startsAt" name="startsAt" type="date" />
          </div>
          <div>
            <Label htmlFor="endsAt">Ends (optional)</Label>
            <Input id="endsAt" name="endsAt" type="date" />
          </div>
        </div>
        <Button type="submit">Create code</Button>
      </form>
    </div>
  );
}