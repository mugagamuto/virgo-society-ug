import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await context.params;

  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const form = await req.formData();
  const doc_type = String(form.get("doc_type") || "");
  const file = form.get("file") as File | null;

  const owner_id = String(form.get("owner_id") || "");
  if (!doc_type) return NextResponse.json({ ok: false, error: "Missing doc_type" }, { status: 400 });
  if (!file) return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  if (!owner_id) return NextResponse.json({ ok: false, error: "Missing owner_id" }, { status: 400 });

  // bucket: member-docs (change if your bucket differs)
  const bucket = "member-docs";
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const key = `projects/${projectId}/${Date.now()}-${doc_type}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const { error: upErr } = await sb.storage.from(bucket).upload(key, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });

  if (upErr) return NextResponse.json({ ok: false, error: upErr }, { status: 500 });

  const file_path = `${bucket}/${key}`;

  const { data: docRow, error: insErr } = await sb
    .from("project_documents")
    .insert({
      project_id: projectId,
      owner_id,
      doc_type,
      file_path,
      original_name: file.name,
    })
    .select("*")
    .single();

  if (insErr) return NextResponse.json({ ok: false, error: insErr }, { status: 500 });

  return NextResponse.json({ ok: true, doc: docRow });
}