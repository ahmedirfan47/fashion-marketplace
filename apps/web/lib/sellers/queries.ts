import { createClient } from "@/lib/supabase/server";

type SellerBrand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  commission_rate: number;
  status: string;
  contact_email: string;
};

export async function getCurrentSellerBrand(): Promise<SellerBrand | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("brand_members")
    .select("brands(id, name, slug, description, commission_rate, status, contact_email)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!data || !data.brands) return null;
  return data.brands as unknown as SellerBrand;
}