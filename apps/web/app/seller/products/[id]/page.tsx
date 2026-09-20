import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct, deleteProduct, addVariant, deleteVariant } from "@/lib/products/actions";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, title, slug, category, description, base_price, status, product_variants(id, sku, size, color, stock_quantity, price_override)"
    )
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const variants = product.product_variants ?? [];
  const updateProductWithId = updateProduct.bind(null, id);
  const deleteProductWithId = deleteProduct.bind(null, id);
  const addVariantWithId = addVariant.bind(null, id);

  return (
    <div className="max-w-lg space-y-10">
      <div>
        <h1 className="font-display text-2xl">Edit product</h1>
        {saved && <p className="mt-2 text-sm text-muted">Saved.</p>}
        {error && <p className="mt-2 text-sm text-accent">{decodeURIComponent(error)}</p>}
      </div>

      <form action={updateProductWithId} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required defaultValue={product.title} className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="slug">URL slug</label>
          <input id="slug" name="slug" type="text" required defaultValue={product.slug} className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="category">Category</label>
          <input id="category" name="category" type="text" required defaultValue={product.category} className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="basePrice">Price (PKR)</label>
          <input id="basePrice" name="basePrice" type="number" min="0" step="1" required defaultValue={product.base_price} className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={product.description ?? ""} className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={product.status} className="w-full border border-border px-3 py-2 text-sm">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button type="submit" className="bg-accent text-accent-ink px-5 py-2.5 text-sm font-medium hover:opacity-90">
          Save changes
        </button>
      </form>

      <div className="space-y-4 border-t border-border pt-8">
        <h2 className="font-display text-xl">Variants</h2>

        {variants.length > 0 ? (
          <div className="divide-y divide-border border-y border-border">
            {variants.map((variant) => {
              const deleteVariantWithIds = deleteVariant.bind(null, id, variant.id);
              return (
                <div key={variant.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p>{[variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku}</p>
                    <p className="text-xs text-muted">
                      SKU {variant.sku} - stock {variant.stock_quantity}
                    </p>
                  </div>
                  <form action={deleteVariantWithIds}>
                    <button type="submit" className="text-xs text-muted hover:text-accent">
                      Remove
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">No variants yet.</p>
        )}

        <form action={addVariantWithId} className="space-y-3 border border-border p-4">
          <p className="text-sm font-medium">Add variant</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" htmlFor="sku">SKU</label>
              <input id="sku" name="sku" type="text" required className="w-full border border-border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs mb-1" htmlFor="stockQuantity">Stock</label>
              <input id="stockQuantity" name="stockQuantity" type="number" min="0" required className="w-full border border-border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs mb-1" htmlFor="size">Size</label>
              <input id="size" name="size" type="text" className="w-full border border-border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs mb-1" htmlFor="color">Color</label>
              <input id="color" name="color" type="text" className="w-full border border-border px-2 py-1.5 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs mb-1" htmlFor="priceOverride">Price override (optional)</label>
              <input id="priceOverride" name="priceOverride" type="number" min="0" step="1" className="w-full border border-border px-2 py-1.5 text-sm" />
            </div>
          </div>
          <button type="submit" className="border border-border px-4 py-2 text-sm hover:bg-surface">
            Add variant
          </button>
        </form>
      </div>

      <form action={deleteProductWithId} className="border-t border-border pt-6">
        <button type="submit" className="text-sm text-accent hover:underline">
          Delete this product
        </button>
      </form>
    </div>
  );
}