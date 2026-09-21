"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";
import { isCurrentUserAdmin } from "@/lib/admin/queries";

export async function createCampaign(formData: FormData) {
  const brand = await getCurrentSellerBrand();
  if (!brand) throw new Error("No brand associated with this account.");

  const supabase = await createClient();
  const productId = formData.get("productId") as string;
  const startsAt = formData.get("startsAt") as string;
  const endsAt = formData.get("endsAt") as string;
  const dailyBudget = Number(formData.get("dailyBudget"));

  const { error } = await supabase.from("ad_campaigns").insert({
    product_id: productId,
    brand_id: brand.id,
    starts_at: startsAt,
    ends_at: endsAt,
    daily_budget: dailyBudget,
    status: "pending",
  });

  if (error) {
    redirect(`/seller/ads?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/seller/ads");
  redirect("/seller/ads?saved=1");
}

export async function setCampaignStatus(campaignId: string, status: string) {
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorized.");
  const supabase = await createClient();
  await supabase.from("ad_campaigns").update({ status }).eq("id", campaignId);
  revalidatePath("/admin/ads");
}