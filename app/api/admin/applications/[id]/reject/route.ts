import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const { error: upErr } = await sb.from("support_applications").update({ status: "rejected" }).eq("id", id);
  if (upErr) return NextResponse.json({ ok: false, error: upErr }, { status: 500 });

  return NextResponse.json({ ok: true });
}