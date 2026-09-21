"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileNav({
  userEmail,
  signOutAction,
}: {
  userEmail?: string | null;
  signOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <span className="font-display text-lg text-ink">Menu</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="h-9 w-9 text-ink">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <form action="/search" method="GET" className="border-b border-border px-6 py-4">
            <input
              type="text"
              name="q"
              placeholder="Search products"
              className="w-full border-b border-border bg-transparent py-2 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </form>

          <nav className="flex flex-col text-lg">
            <Link href="/" onClick={() => setOpen(false)} className="border-b border-border px-6 py-4 text-ink">
              Shop
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="border-b border-border px-6 py-4 text-ink">
              Cart
            </Link>
            {userEmail ? (
              <>
                <Link href="/orders" onClick={() => setOpen(false)} className="border-b border-border px-6 py-4 text-ink">
                  Orders
                </Link>
                <form action={signOutAction}>
                  <button type="submit" className="w-full border-b border-border px-6 py-4 text-left text-ink">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="border-b border-border px-6 py-4 text-ink">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}