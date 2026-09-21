import { createClient } from "@/lib/supabase/server";
import { generatePayoutsManually } from "@/lib/billing/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default async function AdminBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; generated?: string }>;
}) {
  const { error, generated } = await searchParams;
  const supabase = await createClient();

  const { data: payouts } = await supabase
    .from("brand_payouts")
    .select("id, period_start, period_end, total_sales, amount_due, status, brands(name)")
    .order("period_start", { ascending: false });

  const todayIso = new Date().toISOString().slice(0, 10);
  const monthAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Billing</h1>
        <p className="mt-1 text-sm text-muted">
          Commission invoices run automatically on the 1st of each month. Trigger a run manually for any period below.
        </p>
      </div>

      {generated !== undefined && (
        <p className="text-sm text-accent">Generated payouts for {generated} brand(s).</p>
      )}
      {error && <p className="text-sm text-accent">{decodeURIComponent(error)}</p>}

      <form action={generatePayoutsManually} className="flex flex-wrap items-end gap-4 border border-border bg-surface p-6">
        <div>
          <Label htmlFor="periodStart">Period start</Label>
          <Input id="periodStart" name="periodStart" type="date" defaultValue={monthAgoIso} required />
        </div>
        <div>
          <Label htmlFor="periodEnd">Period end</Label>
          <Input id="periodEnd" name="periodEnd" type="date" defaultValue={todayIso} required />
        </div>
        <Button type="submit">Generate payouts</Button>
      </form>

      {payouts && payouts.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {payouts.map((p) => {
              const brand = p.brands as unknown as { name: string } | null;
              return (
                <div key={p.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-ink">{brand?.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {p.period_start} — {p.period_end} · sales {formatPrice(p.total_sales)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={p.status === "paid" ? "accent" : "neutral"}>{p.status}</Badge>
                    <p className="w-24 text-right text-sm text-ink">{formatPrice(p.amount_due)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No payouts generated yet.</p>
      )}
    </div>
  );
}