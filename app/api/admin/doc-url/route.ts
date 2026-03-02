import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function pickBucketAndKey(filePath: string) {
  const clean = filePath.replace(/^\/+/, "");
  const parts = clean.split("/");
  const bucket = parts.shift() || "member-docs";
  const key = parts.join("/");
  return { bucket, key };
}

export async function GET(req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const path = req.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ ok: false, error: "Missing path" }, { status: 400 });

  const { bucket, key } = pickBucketAndKey(path);

  const { data, error: sErr } = await sb.storage.from(bucket).createSignedUrl(key, 300);
  if (sErr) return NextResponse.json({ ok: false, error: sErr }, { status: 500 });

  return NextResponse.json({ ok: true, signedUrl: data.signedUrl, bucket, key });
}