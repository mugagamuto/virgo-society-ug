import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const { data, error: qErr } = await sb
    .from("members")
    .select("id,email,full_name,status,created_at")
    .order("created_at", { ascending: false });

  if (qErr) return NextResponse.json({ ok: false, error: qErr }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  const status = String(body.status || "");
  if (!id || !status) return NextResponse.json({ ok: false, error: "Missing id/status" }, { status: 400 });

  const { error: upErr } = await sb.from("members").update({ status }).eq("id", id);
  if (upErr) return NextResponse.json({ ok: false, error: upErr }, { status: 500 });

  return NextResponse.json({ ok: true });
}