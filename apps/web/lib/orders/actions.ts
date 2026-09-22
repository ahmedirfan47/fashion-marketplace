"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { orderConfirmationEmail } from "@/lib/email/templates";
import { formatPrice } from "@/lib/utils";

type CheckoutItem = {
  variantId: string;
  quantity: number;
};

type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
};

type CreateOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

type DiscountPreviewResult =
  | { valid: true; discountAmount: number; message: string }
  | { valid: false; message: string };

async function resolveDiscount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  code: string,
  subtotal: number
) {
  const { data: discount } = await supabase
    .from("discounts")
    .select("id, discount_type, value, active, starts_at, ends_at")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (!discount || !discount.active) {
    return { valid: false as const, message: "That code is not valid." };
  }

  const now = new Date();
  if (discount.starts_at && new Date(discount.starts_at) > now) {
    return { valid: false as const, message: "That code is not active yet." };
  }
  if (discount.ends_at && new Date(discount.ends_at) < now) {
    return { valid: false as const, message: "That code has expired." };
  }

  const amount =
    discount.discount_type === "percentage"
      ? Number(((subtotal * discount.value) / 100).toFixed(2))
      : Math.min(discount.value, subtotal);

  return { valid: true as const, discountAmount: amount, message: "Code applied." };
}

export async function previewDiscount(code: string, subtotal: number): Promise<DiscountPreviewResult> {
  if (!code.trim()) {
    return { valid: false, message: "Enter a code." };
  }
  const supabase = await createClient();
  const result = await resolveDiscount(supabase, code, subtotal);
  if (!result.valid) return result;
  return { valid: true, discountAmount: result.discountAmount, message: result.message };
}

export async function createOrder(
  items: CheckoutItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  discountCode?: string
): Promise<CreateOrderResult> {
  if (items.length === 0) {
    return { success: false, error: "Cart is empty." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to check out." };
  }

  const { data: orderId, error } = await supabase.rpc("place_order", {
    p_items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    p_shipping_address: shippingAddress,
    p_payment_method: paymentMethod,
    p_discount_code: discountCode,
  });

  if (error || !orderId) {
    return { success: false, error: error?.message ?? "Could not create the order. Please try again." };
  }

  const { data: order } = await supabase.from("orders").select("total").eq("id", orderId).single();

  if (user.email && order) {
    await sendEmail({
      to: user.email,
      subject: "Your order is confirmed",
      html: orderConfirmationEmail(orderId, formatPrice(order.total)),
    });
  }

  return { success: true, orderId };
}