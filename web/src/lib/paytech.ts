import crypto from "node:crypto";

const PAYTECH_REQUEST_URL = "https://paytech.sn/api/payment/request-payment";

type RequestPaymentInput = {
  itemName: string;
  itemPrice: number;
  refCommand: string;
  commandName: string;
  customField?: Record<string, unknown>;
};

type RequestPaymentResponse = {
  success: number;
  token: string;
  redirect_url: string;
  redirectUrl: string;
};

/**
 * Starts a PayTech checkout session for a booking and returns the URL to
 * redirect the passenger to (restricted to Wave and Orange Money).
 * Docs: https://docs.intech.sn/doc_paytech.php
 */
export async function requestPaytechPayment(
  input: RequestPaymentInput
): Promise<RequestPaymentResponse> {
  const apiKey = process.env.PAYTECH_API_KEY;
  const apiSecret = process.env.PAYTECH_API_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!apiKey || !apiSecret || !baseUrl) {
    throw new Error(
      "PayTech is not configured: set PAYTECH_API_KEY, PAYTECH_API_SECRET and NEXT_PUBLIC_SITE_URL."
    );
  }

  const res = await fetch(PAYTECH_REQUEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      API_KEY: apiKey,
      API_SECRET: apiSecret,
    },
    body: JSON.stringify({
      item_name: input.itemName,
      item_price: input.itemPrice,
      currency: "XOF",
      ref_command: input.refCommand,
      command_name: input.commandName,
      env: process.env.PAYTECH_ENV ?? "test",
      ipn_url: `${baseUrl}/api/paytech/ipn`,
      success_url: `${baseUrl}/paiement/succes?ref=${input.refCommand}`,
      cancel_url: `${baseUrl}/paiement/annule?ref=${input.refCommand}`,
      // Restricts the PayTech checkout page to Wave and Orange Money only
      // (no Free Money, cards, ...).
      target_payment: "Wave, Orange Money",
      custom_field: input.customField ? JSON.stringify(input.customField) : undefined,
    }),
  });

  const data = (await res.json()) as RequestPaymentResponse & { success: number };

  if (!res.ok || data.success !== 1) {
    throw new Error("PayTech refused the payment request.");
  }

  return data;
}

/**
 * Verifies an IPN callback came from PayTech, using the HMAC-SHA256 method
 * ( message = "amount|ref_command|api_key", key = api_secret ).
 */
export function verifyPaytechIpn(payload: {
  hmac_compute?: string;
  item_price?: string | number;
  ref_command?: string;
}): boolean {
  const apiKey = process.env.PAYTECH_API_KEY;
  const apiSecret = process.env.PAYTECH_API_SECRET;

  if (!apiKey || !apiSecret || !payload.hmac_compute || !payload.ref_command) {
    return false;
  }

  const message = `${payload.item_price}|${payload.ref_command}|${apiKey}`;
  const expected = crypto
    .createHmac("sha256", apiSecret)
    .update(message)
    .digest("hex");
  const received = payload.hmac_compute;

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}
