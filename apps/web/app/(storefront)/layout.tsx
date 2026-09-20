import { SiteHeader } from "@/components/storefront/site-header";
import { createClient } from "@/lib/supabase/server";
import { CartProvider } from "@/lib/cart/cart-context";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <CartProvider>
      <div className="min-h-screen">
        <SiteHeader userEmail={user?.email ?? null} />
        {children}
      </div>
    </CartProvider>
  );
}