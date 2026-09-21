import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setBrandStatus, addBrandMember, removeBrandMember } from "@/lib/admin/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminBrandDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, slug, status, commission_rate, contact_email")
    .eq("id", id)
    .single();

  if (!brand) {
    notFound();
  }

  const { data: members } = await supabase
    .from("brand_members")
    .select("user_id, profiles(full_name)")
    .eq("brand_id", id);

  const activateBrand = setBrandStatus.bind(null, id, "active");
  const suspendBrand = setBrandStatus.bind(null, id, "suspended");
  const addMemberWithId = addBrandMember.bind(null, id);

  return (
    <div className="max-w-lg space-y-10">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl text-ink">{brand.name}</h1>
          <Badge variant={brand.status === "active" ? "accent" : "neutral"}>{brand.status}</Badge>
        </div>
        {error && <p className="mt-3 text-sm text-accent">{decodeURIComponent(error)}</p>}
      </div>

      <div className="flex gap-3">
        <form action={activateBrand}>
          <Button type="submit" variant="secondary">Approve / activate</Button>
        </form>
        <form action={suspendBrand}>
          <Button type="submit" variant="secondary">Suspend</Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl text-ink">Members</h2>

        {members && members.length > 0 ? (
          <div className="border border-border">
            <div className="divide-y divide-border">
              {members.map((member) => {
                const profile = member.profiles as unknown as { full_name: string | null } | null;
                const removeMemberWithIds = removeBrandMember.bind(null, id, member.user_id);
                return (
                  <div key={member.user_id} className="flex items-center justify-between px-5 py-3.5">
                    <p className="text-sm text-ink">{profile?.full_name ?? member.user_id}</p>
                    <form action={removeMemberWithIds}>
                      <button type="submit" className="text-xs text-muted hover:text-accent">
                        Remove
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">No members yet.</p>
        )}

        <form action={addMemberWithId} className="space-y-3 border border-border bg-surface p-6">
          <p className="text-sm font-medium text-ink">Add member by email</p>
          <Input name="email" type="email" required />
          <Button type="submit" variant="secondary">Add</Button>
        </form>
      </div>
    </div>
  );
}