import Constants from "expo-constants";
import { supabase } from "./supabase";

const apiBaseUrl = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? "";

async function authedFetch(path: string, body: unknown) {
  if (!apiBaseUrl) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL is not set — point it at the deployed SenTrajet web app (e.g. https://sentrajet.sn)."
    );
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "request_failed");
  return data;
}

export function createBooking(trajetId: string, seats: number) {
  return authedFetch("/api/bookings", { trajetId, seats }) as Promise<{
    bookingId: string;
  }>;
}

export function initiatePaytechPayment(bookingId: string) {
  return authedFetch("/api/paytech/initiate", { bookingId }) as Promise<{
    redirectUrl: string;
    ref: string;
  }>;
}
