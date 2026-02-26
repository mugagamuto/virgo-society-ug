"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

const BUCKET = "publics";
const PREFIX = "site/"; // all site images go here

type Item = {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: any;
};

function fmtBytes(n?: number) {
  if (!n && n !== 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let x = n;
  let i = 0;
  while (x >= 1024 && i < units.length - 1) { x /= 1024; i++; }
  return `${x.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function AdminMediaPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter(i => i.name.toLowerCase().includes(qq));
  }, [items, q]);

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
    setMsg(null);

    try {
      const ok = await ensureAdmin();
      if (!ok) return;

      const { data, error } = await supabase.storage.from(BUCKET).list(PREFIX, {
        limit: 100,
        sortBy: { column: "updated_at", order: "desc" },
      });

      if (error) throw error;

      const cleaned = (data ?? [])
        .filter((x: any) => x?.name && x.name !== ".emptyFolderPlaceholder")
        .map((x: any) => ({ ...x, name: x.name }));

      setItems(cleaned);
    } catch (e: any) {
      setMsg(e?.message ?? "Failed to load images. Check bucket name + storage policies.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function publicUrl(path: string) {
    // Public URL works only if bucket is public OR you use signed URLs
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setMsg("✅ Copied URL.");
  }

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setBusy(true);
    setMsg(null);

    try {
      const ok = await ensureAdmin();
      if (!ok) return;

      for (const file of Array.from(files)) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const safeBase = file.name
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9._-]/g, "")
          .replace(/-+/g, "-")
          .slice(0, 80);

        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        const key = `${PREFIX}${stamp}-${safeBase}`;

        const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || (ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg"),
        });

        if (error) throw error;
      }

      setMsg("✅ Upload complete.");
      if (inputRef.current) inputRef.current.value = "";
      await load();
    } catch (e: any) {
      setMsg(e?.message ?? "Upload failed. Check storage policies & bucket.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(name: string) {
    const path = `${PREFIX}${name}`;

    if (!confirm(`Delete this image?\n\n${name}`)) return;

    setBusy(true);
    setMsg(null);

    try {
      const ok = await ensureAdmin();
      if (!ok) return;

      const { error } = await supabase.storage.from(BUCKET).remove([path]);
      if (error) throw error;

      setMsg("✅ Deleted.");
      await load();
    } catch (e: any) {
      setMsg(e?.message ?? "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media Manager</h1>
          <p className="mt-1 text-sm text-mutedInk">Upload website images, copy URLs, and delete old files.</p>
          <p className="mt-1 text-xs text-mutedInk">Bucket: <span className="font-semibold">{BUCKET}</span> • Folder: <span className="font-semibold">{PREFIX}</span></p>
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

      {msg ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white px-5 py-4 text-sm">{msg}</div>
      ) : null}

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-xs font-medium text-mutedInk">Search</div>
            <input
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm"
              placeholder="Search images…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div>
            <div className="text-xs font-medium text-mutedInk">Upload images</div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
              onChange={(e) => upload(e.target.files)}
              disabled={busy}
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-mutedInk">
          Tip: after upload, click <b>Copy URL</b> and paste it anywhere in your website content.
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-black/10 bg-white">
        <div className="border-b border-black/5 px-5 py-4 text-sm font-medium">
          Images • {filtered.length}
        </div>

        {loading ? (
          <div className="px-5 py-6 text-sm text-mutedInk">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-6 text-sm text-mutedInk">No images uploaded yet.</div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((i) => {
              const path = `${PREFIX}${i.name}`;
              const url = publicUrl(path);
              const size = i.metadata?.size ?? i.metadata?.contentLength;

              return (
                <div key={i.name} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{i.name}</div>
                    <div className="mt-1 text-xs text-mutedInk">
                      {fmtBytes(size)} • {i.updated_at ? new Date(i.updated_at).toLocaleString() : "—"}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]"
                        onClick={() => window.open(url, "_blank")}
                      >
                        View
                      </button>
                      <button
                        className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]"
                        onClick={() => copy(url)}
                      >
                        Copy URL
                      </button>
                      <button
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
                        onClick={() => remove(i.name)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-40">
                    <img
                      src={url}
                      alt={i.name}
                      className="h-24 w-full rounded-2xl object-cover border border-black/10 bg-white"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
