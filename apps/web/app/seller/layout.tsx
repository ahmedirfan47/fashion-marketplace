import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { SellerNav } from "@/components/seller/seller-nav";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const brand = await getCurrentSellerBrand();

  if (!brand) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">No brand account yet</h1>
        <p className="mt-3 text-muted">
          Your account is not linked to a brand. Contact the platform admin to get set up as a seller.
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <SellerNav brandName={brand.name} brandStatus={brand.status} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-10 sm:py-12">{children}</div>
      </main>
    </div>
  );
}