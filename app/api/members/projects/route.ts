import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function getUserClient(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  // Read user from Authorization header (optional) OR cookie-based session (not available in plain supabase-js easily).
  // We'll support header token first; if missing, return null.
  const auth = req.headers.get("authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) return null;

  const accessToken = auth.slice(7).trim();
  return { url, anon, accessToken };
}

export async function GET(req: NextRequest) {
  // OPTION 1: If client sends Bearer token
  const u = getUserClient(req);
  if (!u) {
    return NextResponse.json({ ok: false, error: "Not authenticated (missing bearer token)." }, { status: 401 });
  }

  // Validate token by calling auth.getUser with anon client
  const sbUser = createClient(u.url, u.anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${u.accessToken}` } },
  });

  const { data: userData, error: userErr } = await sbUser.auth.getUser();
  if (userErr || !userData?.user?.id) {
    return NextResponse.json({ ok: false, error: "Invalid session." }, { status: 401 });
  }

  const userId = userData.user.id;

  // Use service role to read projects reliably (no RLS issues), but filter by owner_id=userId
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const { data, error: qErr } = await sb
    .from("projects")
    .select("id,title,status,is_fundable,created_at,updated_at,goal_ugx,funded_ugx,budget_ugx")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (qErr) return NextResponse.json({ ok: false, error: qErr }, { status: 500 });

  return NextResponse.json({ ok: true, data });
}