"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="5" rx="1" />
      <rect x="13" y="12" width="8" height="9" rx="1" />
      <rect x="3" y="15" width="8" height="6" rx="1" />
    </svg>
  );
}
function ProductsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.6 12.6l-8-8H4v8.6l8 8a2 2 0 0 0 2.8 0l5.8-5.8a2 2 0 0 0 0-2.8z" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" strokeLinejoin="round" />
      <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
      <path d="M12 13v8" />
    </svg>
  );
}
function DiscountIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12l7-8h9v9l-8 7-8-8z" strokeLinejoin="round" />
      <circle cx="14" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function BillingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" strokeLinejoin="round" />
      <path d="M8.5 8h7M8.5 12h7" strokeLinecap="round" />
    </svg>
  );
}
function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navItems = [
  { href: "/seller/dashboard", label: "Overview", Icon: OverviewIcon },
  { href: "/seller/products", label: "Products", Icon: ProductsIcon },
  { href: "/seller/orders", label: "Orders", Icon: OrdersIcon },
  { href: "/seller/discounts", label: "Discounts", Icon: DiscountIcon },
  { href: "/seller/billing", label: "Billing", Icon: BillingIcon },
];

export function SellerNav({ brandName, brandStatus }: { brandName: string; brandStatus: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface sm:flex">
        <div className="border-b border-border px-6 py-6">
          <p className="text-xs uppercase tracking-wide text-muted">Seller</p>
          <p className="mt-1 font-display text-lg text-ink">{brandName}</p>
          <Badge variant={brandStatus === "active" ? "accent" : "neutral"} className="mt-3">
            {brandStatus}
          </Badge>
        </div>
        <nav className="flex-1 px-3 py-4">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive(href) ? "bg-accent-soft text-accent-soft-ink" : "text-ink hover:bg-background"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border px-3 py-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted transition-colors hover:text-accent">
            <BackIcon className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex items-center gap-1 overflow-x-auto border-b border-border bg-background px-4 py-3 sm:hidden">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`shrink-0 px-3 py-1.5 text-xs whitespace-nowrap ${
              isActive(href) ? "bg-accent-soft text-accent-soft-ink" : "text-muted"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}