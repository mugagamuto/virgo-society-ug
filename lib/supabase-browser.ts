"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (!_client) {
    _client = createClient(url, anonKey);
  }

  return _client;
}

/**
 * Safe export for existing imports like:
 * import { supabase } from "@/lib/supabase-browser";
 *
 * On the server/build, this stays null-ish and does not crash at import time.
 * In the browser, it initializes lazily.
 */
export const supabase = typeof window !== "undefined" ? getSupabaseBrowser() : (null as any);
