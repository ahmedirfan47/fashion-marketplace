import { createBrandWithOwner } from "@/lib/admin/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function NewBrandPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Add brand</h1>
        <p className="mt-1 text-sm text-muted">Create a brand and, optionally, link its first seller.</p>
      </div>

      {error && <p className="text-sm text-accent">{decodeURIComponent(error)}</p>}

      <form action={createBrandWithOwner} className="space-y-5 border border-border bg-surface p-6">
        <div>
          <Label htmlFor="name">Brand name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" name="slug" type="text" required pattern="[a-z0-9-]+" />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" required />
        </div>
        <div>
          <Label htmlFor="commissionRate">Commission rate (%)</Label>
          <Input id="commissionRate" name="commissionRate" type="number" min="0" max="100" step="0.5" required defaultValue="10" />
        </div>
        <div>
          <Label htmlFor="ownerEmail">Owner account email (optional)</Label>
          <Input id="ownerEmail" name="ownerEmail" type="email" />
          <p className="mt-1.5 text-xs text-muted">Must be an email of an account that has already signed up.</p>
        </div>
        <Button type="submit" size="lg">Create brand</Button>
      </form>
    </div>
  );
}