import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function makeRef() {
  return "VBS-" + Math.random().toString(36).slice(2, 8).toUpperCase() + "-" + Date.now().toString().slice(-6);
}

export async function POST(req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const body = await req.json().catch(() => ({}));

  const project_id = String(body.project_id || "");
  const amount_ugx = Number(body.amount_ugx || 0);
  const donor_name = String(body.donor_name || "");
  const donor_email = String(body.donor_email || "");
  const donor_phone = String(body.donor_phone || "");
  const payment_method = String(body.payment_method || "momo");

  if (!project_id) return NextResponse.json({ ok: false, error: "Missing project_id" }, { status: 400 });
  if (!Number.isFinite(amount_ugx) || amount_ugx <= 0) return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });

  // Ensure project is fundable
  const { data: proj, error: pErr } = await sb
    .from("projects")
    .select("id,is_fundable,title")
    .eq("id", project_id)
    .maybeSingle();

  if (pErr) return NextResponse.json({ ok: false, error: pErr }, { status: 500 });
  if (!proj) return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  if (!(proj as any).is_fundable) return NextResponse.json({ ok: false, error: "Project is not published for funding yet." }, { status: 400 });

  const reference = makeRef();

  const { data, error: insErr } = await sb
    .from("donations")
    .insert({
      project_id,
      amount_ugx: Math.floor(amount_ugx),
      donor_name: donor_name || null,
      donor_email: donor_email || null,
      donor_phone: donor_phone || null,
      payment_method,
      status: "pending",
      reference,
    })
    .select("*")
    .single();

  if (insErr) return NextResponse.json({ ok: false, error: insErr }, { status: 500 });

  return NextResponse.json({ ok: true, donation: data });
}