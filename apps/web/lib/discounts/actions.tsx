"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";

export async function createDiscount(formData: FormData) {
  const brand = await getCurrentSellerBrand();
  if (!brand) throw new Error("No brand associated with this account.");

  const supabase = await createClient();
  const code = (formData.get("code") as string).toUpperCase().trim();
  const discountType = formData.get("discountType") as string;
  const value = Number(formData.get("value"));
  const startsAt = formData.get("startsAt") as string;
  const endsAt = formData.get("endsAt") as string;

  const { error } = await supabase.from("discounts").insert({
    brand_id: brand.id,
    code,
    discount_type: discountType,
    value,
    starts_at: startsAt || null,
    ends_at: endsAt || null,
    active: true,
  });

  if (error) {
    redirect(`/seller/discounts?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/seller/discounts");
  redirect("/seller/discounts?saved=1");
}

export async function toggleDiscount(discountId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("discounts").update({ active }).eq("id", discountId);
  revalidatePath("/seller/discounts");
}

export async function deleteDiscount(discountId: string) {
  const supabase = await createClient();
  await supabase.from("discounts").delete().eq("id", discountId);
  revalidatePath("/seller/discounts");
}