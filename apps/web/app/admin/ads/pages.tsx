import { createClient } from "@/lib/supabase/server";
import { setCampaignStatus } from "@/lib/ads/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminAdsPage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("ad_campaigns")
    .select("id, starts_at, ends_at, daily_budget, status, products(title), brands(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Ad campaigns</h1>
        <p className="mt-1 text-sm text-muted">Approve or reject sponsored placement requests.</p>
      </div>

      {campaigns && campaigns.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {campaigns.map((c) => {
              const product = c.products as unknown as { title: string } | null;
              const brand = c.brands as unknown as { name: string } | null;
              const approve = setCampaignStatus.bind(null, c.id, "approved");
              const reject = setCampaignStatus.bind(null, c.id, "rejected");
              return (
                <div key={c.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-ink">{product?.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {brand?.name} · {c.starts_at} — {c.ends_at} · Rs {c.daily_budget}/day
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={c.status === "approved" ? "accent" : "neutral"}>{c.status}</Badge>
                    {c.status === "pending" && (
                      <>
                        <form action={approve}>
                          <Button type="submit" variant="secondary" size="sm">Approve</Button>
                        </form>
                        <form action={reject}>
                          <Button type="submit" variant="secondary" size="sm">Reject</Button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No campaigns submitted yet.</p>
      )}
    </div>
  );
}