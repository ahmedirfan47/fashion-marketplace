"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSellerBrand } from "@/lib/sellers/queries";

export async function createProduct(formData: FormData) {
  const brand = await getCurrentSellerBrand();
  if (!brand) {
    throw new Error("No brand associated with this account.");
  }

  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const basePrice = Number(formData.get("basePrice"));
  const status = formData.get("status") as string;

  const { data, error } = await supabase
    .from("products")
    .insert({
      brand_id: brand.id,
      title,
      slug,
      category,
      description: description || null,
      base_price: basePrice,
      status: status as "draft" | "active" | "archived",
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/seller/products/new?error=${encodeURIComponent(error?.message ?? "Could not create product.")}`);
  }

  revalidatePath("/seller/products");
  redirect(`/seller/products/${data.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const basePrice = Number(formData.get("basePrice"));
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("products")
    .update({
      title,
      slug,
      category,
      description: description || null,
      base_price: basePrice,
      status: status as "draft" | "active" | "archived",
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) {
    redirect(`/seller/products/${productId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/seller/products");
  revalidatePath(`/seller/products/${productId}`);
  redirect(`/seller/products/${productId}?saved=1`);
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/seller/products");
  redirect("/seller/products");
}

export async function addVariant(productId: string, formData: FormData) {
  const supabase = await createClient();

  const sku = formData.get("sku") as string;
  const size = formData.get("size") as string;
  const color = formData.get("color") as string;
  const stockQuantity = Number(formData.get("stockQuantity"));
  const priceOverrideRaw = formData.get("priceOverride") as string;

  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    sku,
    size: size || null,
    color: color || null,
    stock_quantity: stockQuantity,
    price_override: priceOverrideRaw ? Number(priceOverrideRaw) : null,
  });

  if (error) {
    redirect(`/seller/products/${productId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/seller/products/${productId}`);
  redirect(`/seller/products/${productId}?saved=1`);
}

export async function deleteVariant(productId: string, variantId: string) {
  const supabase = await createClient();
  await supabase.from("product_variants").delete().eq("id", variantId);
  revalidatePath(`/seller/products/${productId}`);
  redirect(`/seller/products/${productId}`);
}