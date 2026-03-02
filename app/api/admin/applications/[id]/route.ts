import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sb = supabaseAdmin();

  const { data: appRow, error: appErr } = await sb
    .from("support_applications")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (appErr) return NextResponse.json({ ok: false, error: appErr }, { status: 500 });
  if (!appRow) return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });

  let project = null;
  let documents: any[] = [];

  const projectId = (appRow as any).project_id as string | null;

  if (projectId) {
    const { data: proj, error: projErr } = await sb
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();

    if (projErr) return NextResponse.json({ ok: false, error: projErr }, { status: 500 });
    project = proj ?? null;

    const { data: docs, error: docsErr } = await sb
      .from("project_documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (docsErr) return NextResponse.json({ ok: false, error: docsErr }, { status: 500 });
    documents = docs ?? [];
  }

  return NextResponse.json({ ok: true, application: appRow, project, documents });
}