import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-10 font-display text-xl text-ink">
        Marketplace
      </Link>

      <div className="border border-border bg-surface p-8">
        <h1 className="font-display text-2xl text-ink">Create an account</h1>

        {error && <p className="mt-4 text-sm text-accent">{decodeURIComponent(error)}</p>}

        <form action={signUp} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Create account
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-ink underline underline-offset-2 hover:text-accent">
          Sign in
        </Link>
      </p>
    </main>
  );
}