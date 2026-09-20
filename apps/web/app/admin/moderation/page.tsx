import { createClient } from "@/lib/supabase/server";
import { updateProductStatus } from "@/lib/admin/actions";

export default async function ModerationPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, title, status, brands(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">Moderation</h1>
      <p className="text-sm text-muted">Most recent 50 products across all brands.</p>

      {products && products.length > 0 ? (
        <div className="divide-y divide-border border-y border-border">
          {products.map((product) => {
            const brand = product.brands as unknown as { name: string } | null;
            const archiveProduct = updateProductStatus.bind(null, product.id, "archived");
            const activateProduct = updateProductStatus.bind(null, product.id, "active");
            return (
              <div key={product.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p>{product.title}</p>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    {brand?.name} - {product.status}
                  </p>
                </div>
                <div className="flex gap-3">
                  <form action={activateProduct}>
                    <button type="submit" className="text-xs hover:text-accent">Activate</button>
                  </form>
                  <form action={archiveProduct}>
                    <button type="submit" className="text-xs hover:text-accent">Archive</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted text-sm">No products yet.</p>
      )}
    </div>
  );
}