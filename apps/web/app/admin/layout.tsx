import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/admin/queries";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) redirect("/");

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-10 sm:py-12">{children}</div>
      </main>
    </div>
  );
}