import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("support_applications")
    .select("id,status,created_at,project_id,full_name,email,phone,owner_id")
    .order("status", { ascending: true }) // pending first if you keep statuses lexicographically; optional
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}