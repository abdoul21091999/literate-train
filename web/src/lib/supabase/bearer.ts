import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

/**
 * For JSON API routes called by the mobile app, which authenticates with a
 * Supabase access token in the Authorization header instead of cookies.
 */
export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return { user: null, supabase: null };

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return { user, supabase };
}
