import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-surface-strong text-accent-ink">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl">Marketplace</p>
          <p className="mt-3 max-w-xs text-sm text-accent-ink/70">
            A marketplace for independent fashion and clothing brands, sold
            directly and shipped from Pakistan.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-wide text-accent-ink/50">Shop</p>
          <Link href="/" className="block text-accent-ink/80 transition-colors hover:text-accent-ink">
            All brands
          </Link>
          <Link href="/cart" className="block text-accent-ink/80 transition-colors hover:text-accent-ink">
            Cart
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-wide text-accent-ink/50">Sell with us</p>
          <Link href="/seller/dashboard" className="block text-accent-ink/80 transition-colors hover:text-accent-ink">
            Seller dashboard
          </Link>
        </div>
      </div>
      <div className="border-t border-accent-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-5 text-xs text-accent-ink/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
          <Link href="/waitlist" className="text-accent-ink/70 transition-colors hover:text-accent-ink">
            Join our waiting list
          </Link>
        </div>
      </div>
    </footer>
  );
}