"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type PageRow = {
  slug: string;
  title: string;
  content: any;
  updated_at: string | null;
};

export default function AdminPageEditor({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [row, setRow] = useState<PageRow | null>(null);
  const [title, setTitle] = useState("");
  const [contentText, setContentText] = useState("");

  const pretty = useMemo(() => {
    try { return JSON.stringify(JSON.parse(contentText), null, 2); } catch { return contentText; }
  }, [contentText]);

  async function ensureAdmin() {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      window.location.href = "/admin/login";
      return false;
    }

    const { data: adminRow, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!adminRow) {
      window.location.href = "/admin/login";
      return false;
    }
    return true;
  }

  async function load() {
    setLoading(true);
    setErr(null);
    setOk(null);

    try {
      const isAdmin = await ensureAdmin();
      if (!isAdmin) return;

      const { data, error } = await supabase
        .from("pages")
        .select("slug,title,content,updated_at")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      const r = data as PageRow;
      setRow(r);
      setTitle(r.title ?? "");
      setContentText(JSON.stringify(r.content ?? {}, null, 2));
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load page");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!row) return;
    setSaving(true);
    setErr(null);
    setOk(null);

    try {
      let parsed: any = null;
      try {
        parsed = contentText.trim() ? JSON.parse(contentText) : {};
      } catch {
        throw new Error("Content must be valid JSON.");
      }

      const { error } = await (supabase as any).from("pages").update({ title: title.trim() || row.title, content: parsed } as any).eq("slug", row.slug);

      if (error) throw error;

      setOk("✅ Saved successfully.");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit page</h1>
          <p className="mt-1 text-sm text-mutedInk">Slug: /{slug}</p>
        </div>

        <div className="flex gap-3">
          <Link href="/admin" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            ← Back
          </Link>
          <button onClick={load} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white px-5 py-6 text-sm text-mutedInk">Loading…</div>
      ) : null}

      {err ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{err}</div>
      ) : null}

      {ok ? (
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">{ok}</div>
      ) : null}

      {row ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-mutedInk">Title</div>
              <input
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-2 text-xs text-mutedInk">
                Updated: {row.updated_at ? new Date(row.updated_at).toLocaleString() : "—"}
              </div>
            </div>

            <div className="flex items-end justify-end">
              <button
                onClick={save}
                disabled={saving}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-medium text-mutedInk">Content (JSON)</div>
            <textarea
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-mono"
              rows={18}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              spellCheck={false}
            />
            <div className="mt-2 text-xs text-mutedInk">
              Tip: keep JSON valid. (We format it on save.)
            </div>
          </div>

          <details className="mt-5 rounded-2xl border border-black/10 p-4">
            <summary className="cursor-pointer text-sm font-semibold">Preview JSON</summary>
            <pre className="mt-3 overflow-auto text-xs">{pretty}</pre>
          </details>
        </div>
      ) : null}
    </div>
  );
}
