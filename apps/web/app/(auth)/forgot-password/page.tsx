import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-10 font-display text-xl text-ink">
        Marketplace
      </Link>

      <div className="border border-border bg-surface p-8">
        <h1 className="font-display text-2xl text-ink">Reset your password</h1>
        <p className="mt-2 text-sm text-muted">We will email you a link to set a new one.</p>

        {message === "check_email" && (
          <p className="mt-4 text-sm text-muted">Check your email for the reset link.</p>
        )}
        {error && <p className="mt-4 text-sm text-accent">{decodeURIComponent(error)}</p>}

        <form action={requestPasswordReset} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Send reset link
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-ink underline underline-offset-2 hover:text-accent">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}