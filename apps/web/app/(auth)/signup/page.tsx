import Link from "next/link";
import { signUp } from "@/lib/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl mb-6">Create an account</h1>

      {error && <p className="mb-4 text-sm text-accent">{decodeURIComponent(error)}</p>}

      <form action={signUp} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>
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
            minLength={6}
            className="w-full border border-border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-accent-ink px-5 py-2.5 text-sm font-medium hover:opacity-90"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-ink underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}