import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBrandsPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, status, commission_rate")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="bg-accent text-accent-ink px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Add brand
        </Link>
      </div>

      {brands && brands.length > 0 ? (
        <div className="divide-y divide-border border-y border-border">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/admin/brands/${brand.id}`}
              className="flex items-center justify-between py-3 hover:bg-surface px-2 -mx-2"
            >
              <div>
                <p className="text-sm">{brand.name}</p>
                <p className="text-xs text-muted uppercase tracking-wide">{brand.status}</p>
              </div>
              <p className="text-sm text-muted">{brand.commission_rate}% commission</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm">No brands yet.</p>
      )}
    </div>
  );
}