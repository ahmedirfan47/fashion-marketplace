import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { CartIndicator } from "@/components/storefront/cart-indicator";

type SiteHeaderProps = {
  userEmail?: string | null;
};

export function SiteHeader({ userEmail }: SiteHeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl">
          Marketplace
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-accent transition-colors">
            Shop
          </Link>
          <CartIndicator />
          {userEmail ? (
            <form action={signOut}>
              <button type="submit" className="hover:text-accent transition-colors">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="hover:text-accent transition-colors">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}