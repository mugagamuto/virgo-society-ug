"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AdminGuard } from "@/components/admin/admin-guard";

export default function AdminEditPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [title, setTitle] = useState("");
  const [sectionsText, setSectionsText] = useState("[]");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const jsonValid = useMemo(() => {
    try { JSON.parse(sectionsText); return true; } catch { return false; }
  }, [sectionsText]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
    if (error) setStatus(error.message);

    if (data) {
      setTitle(data.title ?? "");
      setSectionsText(JSON.stringify(data.sections ?? [], null, 2));
    } else {
      // create if missing
      await supabase.from("pages").insert({ slug, title: slug, sections: [] });
      setTitle(slug);
      setSectionsText("[]");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [slug]);

  async function save() {
    setStatus(null);
    if (!jsonValid) {
      setStatus("Sections JSON is invalid. Fix the JSON then save.");
      return;
    }

    const sections = JSON.parse(sectionsText);
    const { error } = await supabase
      .from("pages")
      .update({ title, sections, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (error) setStatus(error.message);
    else setStatus("Saved ✅");
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Edit Page</div>
            <div className="mt-1 text-sm text-mutedInk">Slug: {slug}</div>
          </div>

          <div className="flex gap-2">
            <Link href="/admin" className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]">
              Back
            </Link>
            <button onClick={save} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              Save
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <label className="text-sm font-semibold">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="Page title"
            />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Sections (JSON)</div>
              <div className={"text-xs " + (jsonValid ? "text-emerald-700" : "text-red-600")}>
                {jsonValid ? "Valid JSON" : "Invalid JSON"}
              </div>
            </div>

            <textarea
              value={sectionsText}
              onChange={(e) => setSectionsText(e.target.value)}
              className="mt-3 h-[420px] w-full rounded-2xl border border-black/10 px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
            <div className="mt-3 text-xs text-mutedInk">
              Tip: keep sections as an array, e.g. [{"{"}"type":"text","title":"...","body":"..."{"}"}]
            </div>
          </div>

          {status && (
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
              {status}
            </div>
          )}

          {loading && <div className="text-sm text-mutedInk">Loading…</div>}
        </div>
      </div>
    </AdminGuard>
  );
}