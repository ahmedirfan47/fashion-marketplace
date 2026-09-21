"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFollow(brandId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("brand_follows")
    .select("id")
    .eq("customer_id", user.id)
    .eq("brand_id", brandId)
    .maybeSingle();

  if (existing) {
    await supabase.from("brand_follows").delete().eq("id", existing.id);
  } else {
    await supabase.from("brand_follows").insert({ customer_id: user.id, brand_id: brandId });
  }

  revalidatePath("/saved");
}