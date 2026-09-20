import Link from "next/link";

export function SellerNav({ brandName }: { brandName: string }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Seller</p>
          <p className="font-display text-lg">{brandName}</p>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/seller/dashboard" className="hover:text-accent transition-colors">Overview</Link>
          <Link href="/seller/products" className="hover:text-accent transition-colors">Products</Link>
          <Link href="/seller/orders" className="hover:text-accent transition-colors">Orders</Link>
          <Link href="/seller/billing" className="hover:text-accent transition-colors">Billing</Link>
        </nav>
      </div>
    </header>
  );
}