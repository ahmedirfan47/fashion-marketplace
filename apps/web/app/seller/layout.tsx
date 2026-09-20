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
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl mb-4">No brand account yet</h1>
        <p className="text-muted">
          Your account is not linked to a brand. Contact the platform admin to get set up as a seller.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <SellerNav brandName={brand.name} />
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}