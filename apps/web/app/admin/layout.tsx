import { redirect } from "next/navigation";
import Link from "next/link";
import { isCurrentUserAdmin } from "@/lib/admin/queries";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) redirect("/");

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <p className="font-display text-lg">Admin</p>
          <nav className="flex gap-6 text-sm">
            <Link href="/admin/brands" className="hover:text-accent transition-colors">Brands</Link>
            <Link href="/admin/moderation" className="hover:text-accent transition-colors">Moderation</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}