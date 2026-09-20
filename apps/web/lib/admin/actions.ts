"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/admin/queries";

export async function setBrandStatus(
  brandId: string,
  status: "pending" | "active" | "suspended"
) {
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorized.");
  const supabase = await createClient();
  await supabase.from("brands").update({ status }).eq("id", brandId);
  revalidatePath("/admin/brands");
  revalidatePath(`/admin/brands/${brandId}`);
}

export async function createBrandWithOwner(formData: FormData) {
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorized.");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const commissionRate = Number(formData.get("commissionRate"));
  const ownerEmail = formData.get("ownerEmail") as string;

  const supabase = await createClient();
  const { data: brand, error } = await supabase
    .from("brands")
    .insert({
      name,
      slug,
      contact_email: contactEmail,
      commission_rate: commissionRate,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !brand) {
    redirect(
      `/admin/brands/new?error=${encodeURIComponent(error?.message ?? "Could not create brand.")}`
    );
  }

  if (ownerEmail) {
    const adminClient = createAdminClient();
    const { data: userList, error: lookupError } = await adminClient.auth.admin.listUsers();

    if (lookupError) {
      redirect(
        `/admin/brands/${brand.id}?error=${encodeURIComponent("Brand created, but could not look up owner.")}`
      );
    } else {
      const matchedUser = userList.users.find(
        (u) => u.email?.toLowerCase() === ownerEmail.toLowerCase()
      );
      if (!matchedUser) {
        redirect(
          `/admin/brands/${brand.id}?error=${encodeURIComponent(
            "Brand created, but no account with that email was found."
          )}`
        );
      } else {
        await supabase.from("brand_members").insert({ brand_id: brand.id, user_id: matchedUser.id });
      }
    }
  }

  revalidatePath("/admin/brands");
  redirect(`/admin/brands/${brand.id}`);
}

export async function addBrandMember(brandId: string, formData: FormData) {
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorized.");
  const email = formData.get("email") as string;

  const adminClient = createAdminClient();
  const { data: userList, error: lookupError } = await adminClient.auth.admin.listUsers();

  if (lookupError) {
    redirect(`/admin/brands/${brandId}?error=${encodeURIComponent("Could not look up that user.")}`);
  } else {
    const matchedUser = userList.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      redirect(
        `/admin/brands/${brandId}?error=${encodeURIComponent("No account with that email was found.")}`
      );
    } else {
      const supabase = await createClient();
      await supabase.from("brand_members").insert({ brand_id: brandId, user_id: matchedUser.id });
    }
  }

  revalidatePath(`/admin/brands/${brandId}`);
  redirect(`/admin/brands/${brandId}`);
}

export async function removeBrandMember(brandId: string, userId: string) {
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorized.");
  const supabase = await createClient();
  await supabase.from("brand_members").delete().eq("brand_id", brandId).eq("user_id", userId);
  revalidatePath(`/admin/brands/${brandId}`);
  redirect(`/admin/brands/${brandId}`);
}

export async function updateProductStatus(
  productId: string,
  status: "draft" | "active" | "archived"
) {
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorized.");
  const supabase = await createClient();
  await supabase.from("products").update({ status }).eq("id", productId);
  revalidatePath("/admin/moderation");
}