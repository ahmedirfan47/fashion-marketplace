"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BrandsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l1.5-5h15L21 9" strokeLinejoin="round" />
      <path d="M3 9h18v11H3z" strokeLinejoin="round" />
      <path d="M9 13a3 3 0 0 0 6 0" strokeLinecap="round" />
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
function ModerationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
      <path d="M9.5 12l1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AdsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 11l18-7v16L3 13z" strokeLinejoin="round" />
      <path d="M7 14v4a2 2 0 0 0 2 2h1v-5" strokeLinejoin="round" />
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
  { href: "/admin/brands", label: "Brands", Icon: BrandsIcon },
  { href: "/admin/orders", label: "Orders", Icon: OrdersIcon },
  { href: "/admin/moderation", label: "Moderation", Icon: ModerationIcon },
  { href: "/admin/ads", label: "Ads", Icon: AdsIcon },
  { href: "/admin/billing", label: "Billing", Icon: BillingIcon },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface sm:flex">
        <div className="border-b border-border px-6 py-6">
          <p className="text-xs uppercase tracking-wide text-muted">Platform</p>
          <p className="mt-1 font-display text-lg text-ink">Admin</p>
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