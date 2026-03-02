import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const DEFAULT_BUCKET = "member-docs";

function bucketAndKey(path: string) {
  const clean = path.replace(/^\/+/, "");
  const parts = clean.split("/");

  // If first segment looks like a bucket name, use it
  if (parts.length >= 2 && parts[0] === DEFAULT_BUCKET) {
    return { bucket: parts[0], key: parts.slice(1).join("/") };
  }

  // Otherwise treat full path as key inside default bucket
  return { bucket: DEFAULT_BUCKET, key: clean };
}

export async function GET(req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  const path = req.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ ok: false, error: "Missing path" }, { status: 400 });

  const { bucket, key } = bucketAndKey(path);

  const { data, error: sErr } = await sb.storage.from(bucket).createSignedUrl(key, 300);
  if (sErr) return NextResponse.json({ ok: false, error: sErr, bucket, key }, { status: 404 });

  return NextResponse.json({ ok: true, signedUrl: data.signedUrl, bucket, key });
}