import { createClient } from "@/lib/supabase/server";
import { WaitlistCopyButton } from "@/components/admin/waitlist-copy-button";

export default async function AdminWaitlistPage() {
  const supabase = await createClient();

  const { data: signups, count } = await supabase
    .from("waitlist_signups")
    .select("id, email, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  const emails = (signups ?? []).map((s) => s.email);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Waiting list</h1>
          <p className="mt-1 text-sm text-muted">{count ?? 0} people signed up so far.</p>
        </div>
        <WaitlistCopyButton emails={emails} />
      </div>

      {signups && signups.length > 0 ? (
        <div className="border border-border">
          <div className="divide-y divide-border">
            {signups.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-ink">{s.email}</span>
                <span className="text-muted">
                  {new Date(s.created_at).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No signups yet.</p>
      )}
    </div>
  );
}