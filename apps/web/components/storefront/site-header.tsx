import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { CartIndicator } from "@/components/storefront/cart-indicator";
import { MobileNav } from "@/components/storefront/mobile-nav";

type SiteHeaderProps = {
  userEmail?: string | null;
};

export function SiteHeader({ userEmail }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-ink">
          Marketplace
        </Link>

        <nav className="hidden items-center gap-8 text-sm sm:flex">
          <Link href="/" className="text-ink transition-colors hover:text-accent">
            Shop
          </Link>
          <CartIndicator />
          {userEmail ? (
            <form action={signOut}>
              <button type="submit" className="text-ink transition-colors hover:text-accent">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-ink transition-colors hover:text-accent">
              Sign in
            </Link>
          )}
        </nav>

        <MobileNav userEmail={userEmail} signOutAction={signOut} />
      </div>
    </header>
  );
}