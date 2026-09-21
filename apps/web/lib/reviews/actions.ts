"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const productId = formData.get("productId") as string;
  const orderItemId = formData.get("orderItemId") as string;
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;
  const slug = formData.get("slug") as string;

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    customer_id: user.id,
    order_item_id: orderItemId,
    rating,
    comment: comment || null,
  });

  if (error) {
    redirect(`/products/${slug}?reviewError=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/products/${slug}`);
  redirect(`/products/${slug}?reviewed=1`);
}