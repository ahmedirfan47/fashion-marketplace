"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/admin/queries";
import { generatePayoutsForPeriod } from "@/lib/billing/generate";

export async function generatePayoutsManually(formData: FormData) {
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorized.");

  const periodStart = formData.get("periodStart") as string;
  const periodEnd = formData.get("periodEnd") as string;

  try {
    const result = await generatePayoutsForPeriod(periodStart, periodEnd);
    revalidatePath("/admin/billing");
    redirect(`/admin/billing?generated=${result.brandsProcessed}`);
  } catch (err) {
    redirect(`/admin/billing?error=${encodeURIComponent((err as Error).message)}`);
  }
}