import { createClient } from "@/lib/supabase/server";
import { updateProductStatus } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";

export default async function ModerationPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, title, status, brands(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Moderation</h1>
        <p className="mt-1 text-sm text-muted">Most recent 50 products across all brands.</p>
      </div>

      {products && products.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {products.map((product) => {
              const brand = product.brands as unknown as { name: string } | null;
              const archiveProduct = updateProductStatus.bind(null, product.id, "archived");
              const activateProduct = updateProductStatus.bind(null, product.id, "active");
              return (
                <div key={product.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-ink">{product.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{brand?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={product.status === "active" ? "accent" : "neutral"}>{product.status}</Badge>
                    <form action={activateProduct}>
                      <button type="submit" className="text-xs text-muted hover:text-accent">Activate</button>
                    </form>
                    <form action={archiveProduct}>
                      <button type="submit" className="text-xs text-muted hover:text-accent">Archive</button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-sm text-muted">No products yet.</p>
        </div>
      )}
    </div>
  );
}