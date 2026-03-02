import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return { sb: null as any, error: "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)." };
  if (!key) return { sb: null as any, error: "Missing SUPABASE_SERVICE_ROLE_KEY." };

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return { sb, error: null as string | null };
}