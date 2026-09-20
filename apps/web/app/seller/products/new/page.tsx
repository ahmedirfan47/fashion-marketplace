import { createProduct } from "@/lib/products/actions";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-display text-2xl">Add product</h1>

      {error && <p className="text-sm text-accent">{decodeURIComponent(error)}</p>}

      <form action={createProduct} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="slug">URL slug</label>
          <input id="slug" name="slug" type="text" required pattern="[a-z0-9-]+" className="w-full border border-border px-3 py-2 text-sm" />
          <p className="mt-1 text-xs text-muted">Lowercase letters, numbers, and hyphens only.</p>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="category">Category</label>
          <input id="category" name="category" type="text" required placeholder="e.g. shirts" className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="basePrice">Price (PKR)</label>
          <input id="basePrice" name="basePrice" type="number" min="0" step="1" required className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="draft" className="w-full border border-border px-3 py-2 text-sm">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <button type="submit" className="bg-accent text-accent-ink px-5 py-2.5 text-sm font-medium hover:opacity-90">
          Create product
        </button>
      </form>
    </div>
  );
}