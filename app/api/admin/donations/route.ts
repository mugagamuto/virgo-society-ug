import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const { data, error: qErr } = await (sb as any)
    .from("donations")
    .select("id,project_id,amount_ugx,donor_name,donor_email,donor_phone,payment_method,status,reference,created_at, projects(title, org_name)")
    .order("created_at", { ascending: false });

  if (qErr) return NextResponse.json({ ok: false, error: qErr }, { status: 500 });
  return NextResponse.json({ ok: true, data: data ?? [] });
}