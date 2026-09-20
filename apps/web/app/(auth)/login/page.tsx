import Link from "next/link";
import { signIn } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl mb-6">Sign in</h1>

      {message === "check_email" && (
        <p className="mb-4 text-sm text-muted">Check your email to confirm your account.</p>
      )}
      {error && <p className="mb-4 text-sm text-accent">{decodeURIComponent(error)}</p>}

      <form action={signIn} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-accent-ink px-5 py-2.5 text-sm font-medium hover:opacity-90"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        No account?{" "}
        <Link href="/signup" className="text-ink underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}