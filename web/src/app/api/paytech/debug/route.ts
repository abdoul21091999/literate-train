import { NextResponse } from "next/server";
import { requestPaytechPayment } from "@/lib/paytech";

// Temporary diagnostic endpoint — not linked from any UI, no user data
// touched. Calls PayTech with dummy data and returns the raw result so we
// can see exactly why a payment request is rejected. Remove once the
// PayTech integration is confirmed working.
export async function GET() {
  try {
    const result = await requestPaytechPayment({
      itemName: "Debug",
      itemPrice: 1000,
      refCommand: `DEBUG-${Date.now()}`,
      commandName: "Debug",
    });
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      env: {
        hasApiKey: Boolean(process.env.PAYTECH_API_KEY),
        hasApiSecret: Boolean(process.env.PAYTECH_API_SECRET),
        apiKeyLength: process.env.PAYTECH_API_KEY?.length ?? 0,
        apiSecretLength: process.env.PAYTECH_API_SECRET?.length ?? 0,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
        paytechEnv: process.env.PAYTECH_ENV ?? null,
      },
    });
  }
}
