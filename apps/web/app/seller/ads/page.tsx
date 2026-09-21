import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { createCampaign } from "@/lib/ads/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SellerAdsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const brand = await getCurrentSellerBrand();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, title")
    .eq("brand_id", brand!.id)
    .eq("status", "active");

  const { data: campaigns } = await supabase
    .from("ad_campaigns")
    .select("id, starts_at, ends_at, daily_budget, status, products(title)")
    .eq("brand_id", brand!.id)
    .order("created_at", { ascending: false });

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Advertise</h1>
        <p className="mt-1 text-sm text-muted">
          Featured placement on the homepage and search results. Subject to admin approval.
        </p>
      </div>

      {saved && <p className="text-sm text-accent">Campaign submitted for review.</p>}
      {error && <p className="text-sm text-accent">{decodeURIComponent(error)}</p>}

      {campaigns && campaigns.length > 0 && (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {campaigns.map((c) => {
              const product = c.products as unknown as { title: string } | null;
              return (
                <div key={c.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-ink">{product?.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {c.starts_at} — {c.ends_at} · Rs {c.daily_budget}/day
                    </p>
                  </div>
                  <Badge variant={c.status === "approved" ? "accent" : "neutral"}>{c.status}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {products && products.length > 0 ? (
        <form action={createCampaign} className="space-y-4 border border-border bg-surface p-6">
          <p className="text-sm font-medium text-ink">New campaign</p>
          <div>
            <Label htmlFor="productId">Product</Label>
            <select
              id="productId"
              name="productId"
              required
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startsAt">Starts</Label>
              <Input id="startsAt" name="startsAt" type="date" defaultValue={todayIso} required />
            </div>
            <div>
              <Label htmlFor="endsAt">Ends</Label>
              <Input id="endsAt" name="endsAt" type="date" required />
            </div>
          </div>
          <div>
            <Label htmlFor="dailyBudget">Daily budget (PKR)</Label>
            <Input id="dailyBudget" name="dailyBudget" type="number" min="0" step="1" required />
          </div>
          <Button type="submit">Submit for review</Button>
        </form>
      ) : (
        <p className="text-sm text-muted">You need at least one active product to run a campaign.</p>
      )}
    </div>
  );
}