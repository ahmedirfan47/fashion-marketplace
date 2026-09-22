import Link from "next/link";
import { joinWaitlist } from "@/lib/waitlist/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; joined?: string; already?: string }>;
}) {
  const { error, joined, already } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16 text-center">
      <Link href="/" className="mx-auto mb-10 font-display text-xl text-ink">
        Marketplace
      </Link>

      <h1 className="font-display text-3xl text-ink">Be the first to know</h1>
      <p className="mt-3 text-muted">
        We are putting the finishing touches on the marketplace. Join the
        waiting list and we will email you the moment it is ready.
      </p>

      {joined ? (
        <p className="mt-8 border border-border bg-surface px-5 py-4 text-sm text-ink">
          {already
            ? "You are already on the list — we will be in touch."
            : "You are on the list. We will email you when we launch."}
        </p>
      ) : (
        <form action={joinWaitlist} className="mt-8 space-y-4 text-left">
          {error && <p className="text-sm text-accent">{error}</p>}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Join the waiting list
          </Button>
        </form>
      )}
    </main>
  );
}