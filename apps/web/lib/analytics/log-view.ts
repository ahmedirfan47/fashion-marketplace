import { createClient } from "@/lib/supabase/server";

export async function logProductView(productId: string, brandId: string) {
  const supabase = await createClient();
  await supabase.from("product_views").insert({ product_id: productId, brand_id: brandId });
}