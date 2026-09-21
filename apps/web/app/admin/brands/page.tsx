import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminBrandsPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, status, commission_rate")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Brands</h1>
          <p className="mt-1 text-sm text-muted">Every brand on the platform.</p>
        </div>
        <LinkButton href="/admin/brands/new">Add brand</LinkButton>
      </div>

      {brands && brands.length > 0 ? (
        <div className="border border-border">
          <div className="hidden grid-cols-[1fr_120px_140px] gap-4 border-b border-border bg-surface px-5 py-3 text-xs uppercase tracking-wide text-muted sm:grid">
            <span>Brand</span>
            <span>Status</span>
            <span className="text-right">Commission</span>
          </div>
          <div className="divide-y divide-border">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/admin/brands/${brand.id}`}
                className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface sm:grid-cols-[1fr_120px_140px]"
              >
                <span className="text-sm text-ink">{brand.name}</span>
                <Badge variant={brand.status === "active" ? "accent" : "neutral"}>{brand.status}</Badge>
                <span className="text-right text-sm text-ink">{brand.commission_rate}%</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-sm text-muted">No brands yet.</p>
        </div>
      )}
    </div>
  );
}