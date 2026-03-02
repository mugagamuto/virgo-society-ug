import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await context.params;
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const user_id = String(body.user_id || "");
  const full_name = String(body.full_name || "");
  const email = String(body.email || "");
  const phone = String(body.phone || "");

  if (!user_id) return NextResponse.json({ ok: false, error: "Missing user_id" }, { status: 400 });

  // Ensure docs exist
  const { count, error: cErr } = await sb
    .from("project_documents")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (cErr) return NextResponse.json({ ok: false, error: cErr }, { status: 500 });
  if (!count || count < 1) return NextResponse.json({ ok: false, error: "Upload at least 1 document before submitting." }, { status: 400 });

  // Update project to pending
  const { data: proj, error: pErr } = await sb
    .from("projects")
    .update({ status: "pending", submitted_at: new Date().toISOString() })
    .eq("id", projectId)
    .select("*")
    .maybeSingle();

  if (pErr) return NextResponse.json({ ok: false, error: pErr }, { status: 500 });
  if (!proj) return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });

  // Upsert application (linked by project_id)
  const { data: app, error: aErr } = await sb
    .from("support_applications")
    .upsert(
      {
        project_id: projectId,
        user_id,
        full_name: full_name || null,
        email: email || null,
        phone: phone || null,
        status: "pending",
        org_name: (proj as any).org_name ?? null,
        members_count: (proj as any).members_count ?? null,
        project_title: (proj as any).title ?? null,
        project_description: (proj as any).description ?? null,
        project_goals: (proj as any).goals ?? null,
        project_stage: (proj as any).stage ?? null,
        project_budget_ugx: (proj as any).budget_ugx ?? null,
        budget_ugx: (proj as any).budget_ugx ?? null,
        submitted_at: new Date().toISOString(),
        is_fundable: false,
        amount_raised_ugx: 0,
      } as any,
      { onConflict: "project_id" }
    )
    .select("*")
    .single();

  if (aErr) return NextResponse.json({ ok: false, error: aErr }, { status: 500 });

  return NextResponse.json({ ok: true, project: proj, application: app });
}