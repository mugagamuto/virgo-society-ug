"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ImageCropModal } from "@/components/admin/image-crop-modal";
import { cropAndResizeToJpeg, fileToDataURL, safeSlug } from "@/lib/image";

type Row = {
  id: string;
  sort_order: number;
  title: string;
  subtitle: string;
  image_url: string;
  href: string;
  is_active: boolean;
};

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/20"
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "inline-flex h-9 w-16 items-center rounded-full border border-black/10 px-1 transition " +
        (checked ? "bg-emerald-600" : "bg-black/10")
      }
      aria-label="Toggle active"
    >
      <span className={"h-7 w-7 rounded-full bg-white shadow transition " + (checked ? "translate-x-7" : "translate-x-0")} />
    </button>
  );
}

export default function AdminGalleryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Crop modal state
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string>("");
  const [cropRow, setCropRow] = useState<Row | null>(null);

  const sorted = useMemo(() => [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)), [rows]);

  async function load() {
    setLoading(true);
    setMsg(null);
    const { data, error } = await supabase
      .from("home_gallery_items")
      .select("id, sort_order, title, subtitle, image_url, href, is_active")
      .order("sort_order", { ascending: true });

    if (error) {
      setMsg("Failed to load: " + error.message);
      setRows([]);
    } else {
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function saveRow(r: Row) {
    setSavingId(r.id);
    setMsg(null);

    const payload = {
      sort_order: Number(r.sort_order) || 0,
      title: r.title.trim(),
      subtitle: r.subtitle.trim(),
      image_url: r.image_url.trim(),
      href: (r.href.trim() || "/impact"),
      is_active: !!r.is_active,
    };

    const { error } = await supabase.from("home_gallery_items").update(payload).eq("id", r.id);
    if (error) setMsg("Save failed: " + error.message);
    else setMsg("Saved ✅");

    setSavingId(null);
    await load();
  }

  async function addRow() {
    setMsg(null);
    const nextOrder = (sorted[sorted.length - 1]?.sort_order ?? 0) + 1;

    const { error } = await supabase.from("home_gallery_items").insert({
      sort_order: nextOrder,
      title: "New item",
      subtitle: "Short description",
      image_url: "/photos/children.jpg",
      href: "/impact",
      is_active: true,
    });

    if (error) setMsg("Add failed: " + error.message);
    else setMsg("Added ✅");
    await load();
  }

  async function deleteRow(id: string) {
    if (!confirm("Delete this item?")) return;
    setMsg(null);
    const { error } = await supabase.from("home_gallery_items").delete().eq("id", id);
    if (error) setMsg("Delete failed: " + error.message);
    else setMsg("Deleted ✅");
    await load();
  }

  async function openCropForRow(r: Row, file: File) {
    setMsg(null);
    setUploadingId(r.id);
    try {
      const src = await fileToDataURL(file);
      setCropSrc(src);
      setCropRow(r);
      setCropOpen(true);
    } catch (e: any) {
      setMsg("Failed to read image: " + (e?.message ?? String(e)));
      setUploadingId(null);
    }
  }

  async function confirmCrop(areaPixels: any, opts: { aspect: number; maxWidth: number; quality: number }) {
    if (!cropRow) return;
    const r = cropRow;

    try {
      setMsg(null);

      const base = safeSlug(r.title || "gallery");
      const { blob, filename } = await cropAndResizeToJpeg({
        dataUrl: cropSrc,
        crop: areaPixels,
        maxWidth: opts.maxWidth,
        quality: opts.quality,
        filenameBase: base,
      });

      const key = `gallery/${filename}`;

      const { error: upErr } = await supabase.storage.from("site").upload(key, blob, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from("site").getPublicUrl(key);
      const publicUrl = data.publicUrl;

      updateRow(r.id, { image_url: publicUrl });

      const { error: saveErr } = await supabase.from("home_gallery_items").update({ image_url: publicUrl }).eq("id", r.id);
      if (saveErr) throw saveErr;

      setMsg("Uploaded ✅");
      setCropOpen(false);
      setCropRow(null);
      setCropSrc("");
      await load();
    } catch (e: any) {
      setMsg("Upload failed: " + (e?.message ?? String(e)));
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <ImageCropModal
        open={cropOpen}
        imageSrc={cropSrc}
        title={cropRow ? `Crop: ${cropRow.title}` : "Crop image"}
        onClose={() => {
          setCropOpen(false);
          setCropRow(null);
          setCropSrc("");
          setUploadingId(null);
        }}
        onConfirm={confirmCrop}
      />

      <div className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Admin</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Homepage Gallery</h1>
              <p className="mt-1 text-sm text-mutedInk">
                Upload images with <b>crop + auto-resize</b> for clean mobile UI. Recommended aspect: <b>Card 4:3</b>.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
              >
                Back
              </Link>

              <button
                onClick={addRow}
                className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
              >
                + Add item
              </button>
            </div>
          </div>

          {msg ? <div className="mt-3 text-sm text-mutedInk">{msg}</div> : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="text-sm text-mutedInk">Loading…</div>
        ) : sorted.length === 0 ? (
          <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 text-sm text-mutedInk">
            No items found. Click “Add item”.
          </div>
        ) : (
          <div className="grid gap-4">
            {sorted.map((r) => (
              <div key={r.id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-16 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02]">
                      {r.image_url ? (
                        <img src={r.image_url} alt={r.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-mutedInk">No image</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.title || "Item"}</div>
                      <div className="text-xs text-mutedInk">ID: {r.id.slice(0, 8)}…</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-xs text-mutedInk">Active</div>
                    <Toggle checked={!!r.is_active} onChange={(v) => updateRow(r.id, { is_active: v })} />
                    <button
                      onClick={() => deleteRow(r.id)}
                      className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/[0.02]"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold text-mutedInk uppercase">Title</div>
                    <div className="mt-1">
                      <Input value={r.title ?? ""} onChange={(v) => updateRow(r.id, { title: v })} />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-mutedInk uppercase">Order</div>
                    <div className="mt-1">
                      <Input value={String(r.sort_order ?? 0)} onChange={(v) => updateRow(r.id, { sort_order: Number(v) || 0 })} />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-xs font-semibold text-mutedInk uppercase">Subtitle</div>
                    <div className="mt-1">
                      <Input value={r.subtitle ?? ""} onChange={(v) => updateRow(r.id, { subtitle: v })} />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-mutedInk uppercase">Image URL</div>
                    <div className="mt-1">
                      <Input value={r.image_url ?? ""} onChange={(v) => updateRow(r.id, { image_url: v })} placeholder="Paste URL or upload" />
                    </div>

                    <div className="mt-3 rounded-2xl border border-black/10 bg-black/[0.02] p-3">
                      <div className="text-xs font-semibold text-mutedInk uppercase">Upload (crop + resize)</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          openCropForRow(r, f);
                          e.currentTarget.value = "";
                        }}
                        className="mt-2 block w-full text-sm"
                      />
                      {uploadingId === r.id ? <div className="mt-2 text-xs text-mutedInk">Preparing…</div> : null}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-mutedInk uppercase">Link (href)</div>
                    <div className="mt-1">
                      <Input value={r.href ?? ""} onChange={(v) => updateRow(r.id, { href: v })} placeholder="/impact" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveRow(r)}
                    disabled={savingId === r.id}
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                  >
                    {savingId === r.id ? "Saving…" : "Save"}
                  </button>

                  <button
                    onClick={load}
                    className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}