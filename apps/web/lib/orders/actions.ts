"use server";

import { createClient } from "@/lib/supabase/server";

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

export async function createOrder(
  items: CheckoutItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string
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

  const variantIds = items.map((i) => i.variantId);

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select(
      "id, price_override, stock_quantity, products(base_price, brand_id, brands(commission_rate))"
    )
    .in("id", variantIds);

  if (variantsError || !variants || variants.length !== variantIds.length) {
    return { success: false, error: "Some items in your cart are no longer available." };
  }

  type VariantRow = {
    id: string;
    price_override: number | null;
    stock_quantity: number;
    products: {
      base_price: number;
      brand_id: string;
      brands: { commission_rate: number } | null;
    } | null;
  };

  const variantMap = new Map((variants as unknown as VariantRow[]).map((v) => [v.id, v]));

  let subtotal = 0;
  const lineItems: Array<{
    product_variant_id: string;
    brand_id: string;
    quantity: number;
    unit_price: number;
    commission_rate: number;
    commission_amount: number;
  }> = [];

  for (const item of items) {
    const variant = variantMap.get(item.variantId);
    if (!variant || !variant.products) {
      return { success: false, error: "One of the items could not be found." };
    }
    if (variant.stock_quantity < item.quantity) {
      return { success: false, error: "Not enough stock for one of the items." };
    }

    const unitPrice = variant.price_override ?? variant.products.base_price;
    const commissionRate = variant.products.brands?.commission_rate ?? 0;
    const lineTotal = unitPrice * item.quantity;
    const commissionAmount = Number(((lineTotal * commissionRate) / 100).toFixed(2));

    subtotal += lineTotal;
    lineItems.push({
      product_variant_id: variant.id,
      brand_id: variant.products.brand_id,
      quantity: item.quantity,
      unit_price: unitPrice,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
    });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: user.id,
      status: "pending",
      subtotal,
      total: subtotal,
      payment_method: paymentMethod,
      payment_status: "unpaid",
      shipping_address: shippingAddress,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: "Could not create the order. Please try again." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lineItems.map((item) => ({ ...item, order_id: order.id }))
  );

  if (itemsError) {
    return { success: false, error: "Could not save order items. Please try again." };
  }

  return { success: true, orderId: order.id };
}