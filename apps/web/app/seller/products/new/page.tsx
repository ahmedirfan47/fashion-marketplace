import { createProduct } from "@/lib/products/actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Add product</h1>
        <p className="mt-1 text-sm text-muted">New products start as a draft until you publish them.</p>
      </div>

      {error && <p className="text-sm text-accent">{decodeURIComponent(error)}</p>}

      <form action={createProduct} className="space-y-5 border border-border bg-surface p-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" type="text" required />
        </div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" name="slug" type="text" required pattern="[a-z0-9-]+" />
          <p className="mt-1.5 text-xs text-muted">Lowercase letters, numbers, and hyphens only.</p>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" type="text" required placeholder="e.g. shirts" />
        </div>
        <div>
          <Label htmlFor="basePrice">Price (PKR)</Label>
          <Input id="basePrice" name="basePrice" type="number" min="0" step="1" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue="draft"
            className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <Button type="submit" size="lg">Create product</Button>
      </form>
    </div>
  );
}