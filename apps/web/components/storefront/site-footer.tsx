import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg">Marketplace</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            A marketplace for independent fashion and clothing brands.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted">Shop</p>
            <Link href="/" className="block hover:text-accent transition-colors">
              All brands
            </Link>
            <Link href="/cart" className="block hover:text-accent transition-colors">
              Cart
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted">Sell</p>
            <Link href="/seller/dashboard" className="block hover:text-accent transition-colors">
              Seller dashboard
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-muted">
          © {new Date().getFullYear()} Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}