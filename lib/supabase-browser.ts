import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton in the browser to avoid multiple clients (reduces Navigator Lock timeouts)
declare global {
  // eslint-disable-next-line no-var
  var __supabase__: ReturnType<typeof createClient> | undefined;
}

export const supabase =
  globalThis.__supabase__ ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });

if (typeof window !== "undefined") globalThis.__supabase__ = supabase;
