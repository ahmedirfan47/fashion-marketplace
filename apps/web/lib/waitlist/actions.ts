"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();

  if (!email || !email.includes("@") || !email.includes(".")) {
    redirect(`/waitlist?error=${encodeURIComponent("Enter a valid email address.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_signups").insert({ email });

  if (error) {
    if (error.code === "23505") {
      redirect("/waitlist?joined=1&already=1");
    }
    redirect(`/waitlist?error=${encodeURIComponent("Something went wrong. Please try again.")}`);
  }

  redirect("/waitlist?joined=1");
}