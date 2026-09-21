import { createClient } from "@/lib/supabase/server";

export async function isBrandFollowed(brandId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("brand_follows")
    .select("id")
    .eq("customer_id", user.id)
    .eq("brand_id", brandId)
    .maybeSingle();

  return !!data;
}