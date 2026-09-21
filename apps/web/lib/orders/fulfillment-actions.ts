"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { fulfillmentUpdateEmail } from "@/lib/email/templates";

export async function updateFulfillmentStatus(orderItemId: string, status: string) {
  const supabase = await createClient();

  await supabase
    .from("order_items")
    .update({ fulfillment_status: status as "pending" | "processing" | "shipped" | "delivered" | "cancelled" })
    .eq("id", orderItemId);

  if (status === "shipped" || status === "delivered") {
    const { data: item } = await supabase
      .from("order_items")
      .select("orders(customer_id), product_variants(products(title))")
      .eq("id", orderItemId)
      .single();

    const order = item?.orders as unknown as { customer_id: string } | null;
    const variant = item?.product_variants as unknown as { products: { title: string } | null } | null;

    if (order?.customer_id && variant?.products?.title) {
      const adminClient = createAdminClient();
      const { data: userData } = await adminClient.auth.admin.getUserById(order.customer_id);
      if (userData.user?.email) {
        await sendEmail({
          to: userData.user.email,
          subject: `Your order is now ${status}`,
          html: fulfillmentUpdateEmail(variant.products.title, status),
        });
      }
    }
  }

  revalidatePath("/seller/orders");
  revalidatePath("/orders");
}