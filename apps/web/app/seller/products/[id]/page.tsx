import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  updateProduct,
  deleteProduct,
  addVariant,
  deleteVariant,
  uploadProductImage,
  deleteProductImage,
} from "@/lib/products/actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const { data: images } = await supabase
    .from("product_images")
    .select("id, url, storage_path, position")
    .eq("product_id", id)
    .order("position", { ascending: true });

  const variants = product.product_variants ?? [];
  const updateProductWithId = updateProduct.bind(null, id);
  const deleteProductWithId = deleteProduct.bind(null, id);
  const addVariantWithId = addVariant.bind(null, id);
  const uploadImageWithId = uploadProductImage.bind(null, id);

  return (
    <div className="max-w-lg space-y-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Edit product</h1>
        {saved && <p className="mt-2 text-sm text-accent">Changes saved.</p>}
        {error && <p className="mt-2 text-sm text-accent">{decodeURIComponent(error)}</p>}
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl text-ink">Images</h2>

        {images && images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img) => {
              const deleteImageWithIds = deleteProductImage.bind(null, id, img.id, img.storage_path);
              return (
                <div key={img.id} className="group relative aspect-square overflow-hidden border border-border">
                  <Image src={img.url} alt="" fill className="object-cover" />
                  <form action={deleteImageWithIds} className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-opacity group-hover:bg-ink/50 group-hover:opacity-100">
                    <button type="submit" className="bg-background px-3 py-1.5 text-xs text-ink">
                      Remove
                    </button>
                  </form>
                  {img.position === 0 && (
                    <Badge variant="accent" className="absolute top-2 left-2">Main</Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <form action={uploadImageWithId} className="flex items-center gap-3 border border-dashed border-border-strong p-5">
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="flex-1 text-sm text-muted file:mr-3 file:border-0 file:bg-accent-soft file:px-3 file:py-1.5 file:text-xs file:text-accent-soft-ink"
          />
          <Button type="submit" variant="secondary" size="sm">Upload</Button>
        </form>
        <p className="text-xs text-muted">The first image uploaded becomes the main image shown in listings.</p>
      </div>

      <form action={updateProductWithId} className="space-y-5 border border-border bg-surface p-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" type="text" required defaultValue={product.title} />
        </div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" name="slug" type="text" required defaultValue={product.slug} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" type="text" required defaultValue={product.category} />
        </div>
        <div>
          <Label htmlFor="basePrice">Price (PKR)</Label>
          <Input id="basePrice" name="basePrice" type="number" min="0" step="1" required defaultValue={product.base_price} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={product.description ?? ""} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={product.status}
            className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <Button type="submit" size="lg">Save changes</Button>
      </form>

      <div className="space-y-4">
        <h2 className="font-display text-xl text-ink">Variants</h2>

        {variants.length > 0 ? (
          <div className="border border-border">
            <div className="divide-y divide-border">
              {variants.map((variant) => {
                const deleteVariantWithIds = deleteVariant.bind(null, id, variant.id);
                return (
                  <div key={variant.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm text-ink">
                        {[variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">SKU {variant.sku}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={variant.stock_quantity > 0 ? "accent" : "neutral"}>
                        {variant.stock_quantity > 0 ? `${variant.stock_quantity} in stock` : "Out of stock"}
                      </Badge>
                      <form action={deleteVariantWithIds}>
                        <button type="submit" className="text-xs text-muted hover:text-accent">
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">No variants yet.</p>
        )}

        <form action={addVariant.bind(null, id)} className="space-y-4 border border-border bg-surface p-6">
          <p className="text-sm font-medium text-ink">Add variant</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" type="text" required />
            </div>
            <div>
              <Label htmlFor="stockQuantity">Stock</Label>
              <Input id="stockQuantity" name="stockQuantity" type="number" min="0" required />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Input id="size" name="size" type="text" />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" type="text" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="priceOverride">Price override (optional)</Label>
              <Input id="priceOverride" name="priceOverride" type="number" min="0" step="1" />
            </div>
          </div>
          <Button type="submit" variant="secondary">Add variant</Button>
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