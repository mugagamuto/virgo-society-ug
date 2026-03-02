import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const { data, error: qErr } = await sb
    .from("members")
    .select("user_id,email,contact_name,phone,org_name,status,created_at")
    .order("created_at", { ascending: false });

  if (qErr) return NextResponse.json({ ok: false, error: qErr }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const user_id = String(body.user_id || "");
  const status = String(body.status || "");
  if (!user_id || !status) return NextResponse.json({ ok: false, error: "Missing user_id/status" }, { status: 400 });

  const { error: upErr } = await sb.from("members").update({ status }).eq("user_id", user_id);
  if (upErr) return NextResponse.json({ ok: false, error: upErr }, { status: 500 });

  return NextResponse.json({ ok: true });
}