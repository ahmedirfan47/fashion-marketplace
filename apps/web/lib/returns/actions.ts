"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestReturn(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const orderItemId = formData.get("orderItemId") as string;
  const reason = formData.get("reason") as string;
  const orderId = formData.get("orderId") as string;

  const { data: item } = await supabase
    .from("order_items")
    .select("id, brand_id, orders(customer_id)")
    .eq("id", orderItemId)
    .single();

  const order = item?.orders as unknown as { customer_id: string } | null;
  if (!item || !order || order.customer_id !== user.id) {
    redirect(`/orders/${orderId}?error=${encodeURIComponent("Could not submit return request.")}`);
  }

  const { error } = await supabase.from("return_requests").insert({
    order_item_id: orderItemId,
    brand_id: item.brand_id,
    customer_id: user.id,
    reason,
    status: "requested",
  });

  if (error) {
    redirect(`/orders/${orderId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}?returnRequested=1`);
}

export async function resolveReturn(returnId: string, status: string, refundAmount?: number) {
  const supabase = await createClient();
  await supabase
    .from("return_requests")
    .update({
      status,
      refund_amount: refundAmount ?? null,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", returnId);
  revalidatePath("/seller/returns");
}