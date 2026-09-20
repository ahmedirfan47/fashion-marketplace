import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setBrandStatus, addBrandMember, removeBrandMember } from "@/lib/admin/actions";

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
        <h1 className="font-display text-2xl">{brand.name}</h1>
        <p className="text-sm text-muted uppercase tracking-wide">{brand.status}</p>
        {error && <p className="mt-2 text-sm text-accent">{decodeURIComponent(error)}</p>}
      </div>

      <div className="flex gap-3">
        <form action={activateBrand}>
          <button type="submit" className="border border-border px-4 py-2 text-sm hover:bg-surface">
            Approve / activate
          </button>
        </form>
        <form action={suspendBrand}>
          <button type="submit" className="border border-border px-4 py-2 text-sm hover:bg-surface">
            Suspend
          </button>
        </form>
      </div>

      <div className="space-y-4 border-t border-border pt-8">
        <h2 className="font-display text-xl">Members</h2>

        {members && members.length > 0 ? (
          <div className="divide-y divide-border border-y border-border">
            {members.map((member) => {
              const profile = member.profiles as unknown as { full_name: string | null } | null;
              const removeMemberWithIds = removeBrandMember.bind(null, id, member.user_id);
              return (
                <div key={member.user_id} className="flex items-center justify-between py-3 text-sm">
                  <p>{profile?.full_name ?? member.user_id}</p>
                  <form action={removeMemberWithIds}>
                    <button type="submit" className="text-xs text-muted hover:text-accent">
                      Remove
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">No members yet.</p>
        )}

        <form action={addMemberWithId} className="space-y-3 border border-border p-4">
          <p className="text-sm font-medium">Add member by email</p>
          <input name="email" type="email" required className="w-full border border-border px-2 py-1.5 text-sm" />
          <button type="submit" className="border border-border px-4 py-2 text-sm hover:bg-surface">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}