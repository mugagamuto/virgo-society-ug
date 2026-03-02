import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const sb = supabaseAdmin();

  // load application
  const { data: appRow, error: appErr } = await sb
    .from("support_applications")
    .select("id,project_id")
    .eq("id", params.id)
    .maybeSingle();

  if (appErr) return NextResponse.json({ ok: false, error: appErr }, { status: 500 });
  if (!appRow) return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });

  // approve application
  const { error: upErr } = await sb
    .from("support_applications")
    .update({ status: "approved" })
    .eq("id", params.id);

  if (upErr) return NextResponse.json({ ok: false, error: upErr }, { status: 500 });

  // publish project
  const pid = (appRow as any).project_id as string | null;
  if (pid) {
    const { error: pErr } = await sb
      .from("projects")
      .update({ is_fundable: true, status: "approved" })
      .eq("id", pid);

    if (pErr) return NextResponse.json({ ok: false, error: pErr }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}