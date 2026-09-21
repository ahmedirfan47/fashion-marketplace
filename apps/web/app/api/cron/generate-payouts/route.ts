import { NextResponse } from "next/server";
import { generatePayoutsForPeriod } from "@/lib/billing/generate";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const result = await generatePayoutsForPeriod(
    periodStart.toISOString(),
    periodEnd.toISOString()
  );

  return NextResponse.json(result);
}