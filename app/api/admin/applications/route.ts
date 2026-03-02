import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const { data, error: qErr } = await sb
    .from("support_applications")
    .select("id,status,created_at,project_id,full_name,email,phone,user_id")
    .order("created_at", { ascending: false });

  if (qErr) return NextResponse.json({ ok: false, error: qErr }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}