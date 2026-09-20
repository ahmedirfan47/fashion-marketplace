import { createBrandWithOwner } from "@/lib/admin/actions";

export default async function NewBrandPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-display text-2xl">Add brand</h1>

      {error && <p className="text-sm text-accent">{decodeURIComponent(error)}</p>}

      <form action={createBrandWithOwner} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">Brand name</label>
          <input id="name" name="name" type="text" required className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="slug">URL slug</label>
          <input id="slug" name="slug" type="text" required pattern="[a-z0-9-]+" className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="contactEmail">Contact email</label>
          <input id="contactEmail" name="contactEmail" type="email" required className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="commissionRate">Commission rate (%)</label>
          <input id="commissionRate" name="commissionRate" type="number" min="0" max="100" step="0.5" required defaultValue="10" className="w-full border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="ownerEmail">Owner account email (optional)</label>
          <input id="ownerEmail" name="ownerEmail" type="email" className="w-full border border-border px-3 py-2 text-sm" />
          <p className="mt-1 text-xs text-muted">Must be an email of an account that has already signed up. Leave blank to add an owner later.</p>
        </div>
        <button type="submit" className="bg-accent text-accent-ink px-5 py-2.5 text-sm font-medium hover:opacity-90">
          Create brand
        </button>
      </form>
    </div>
  );
}