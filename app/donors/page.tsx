"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string | null;
  description: string | null;
  org_name: string | null;
  district: string | null;
  stage: string | null;
  is_fundable: boolean | null;
  goal_ugx: number | null;
  funded_ugx: number | null;
  created_at: string;
};

function fmtUgx(n?: number | null) {
  if (n === null || n === undefined) return "UGX 0";
  return `UGX ${Number(n).toLocaleString()}`;
}

export default function DonorsPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const { data, error } = await (supabase as any)
        .from("projects")
        .select("id,title,description,org_name,district,stage,is_fundable,goal_ugx,funded_ugx,created_at")
        .eq("is_fundable", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects((data ?? []) as Project[]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Fund a Project</h1>
          <p className="mt-2 text-sm text-mutedInk">Support verified community projects across Uganda.</p>
        </div>
        <Link href="/" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
          ← Back
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">Published projects</div>
          <button onClick={load} className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-mutedInk">Loading…</div>
        ) : err ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div>
        ) : projects.length === 0 ? (
          <div className="mt-4 text-sm text-mutedInk">No published projects yet.</div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <div key={p.id} className="rounded-3xl border border-black/10 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{p.title ?? "Untitled project"}</div>
                    <div className="mt-1 text-xs text-mutedInk">
                      {p.org_name ?? "—"} • {p.district ?? "—"} • Stage: {p.stage ?? "—"}
                    </div>
                  </div>

                  {/* IMPORTANT: always use p.id */}
                  <Link
                    href={`/donors/${encodeURIComponent(p.id)}`}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    View / Fund →
                  </Link>
                </div>

                {p.description ? (
                  <p className="mt-3 text-sm text-mutedInk line-clamp-3">{p.description}</p>
                ) : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-black/10 p-3">
                    <div className="text-xs text-mutedInk">Goal</div>
                    <div className="mt-1 text-sm font-semibold">{fmtUgx(p.goal_ugx)}</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 p-3">
                    <div className="text-xs text-mutedInk">Raised</div>
                    <div className="mt-1 text-sm font-semibold">{fmtUgx(p.funded_ugx)}</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 p-3">
                    <div className="text-xs text-mutedInk">Status</div>
                    <div className="mt-1 text-sm font-semibold">Published</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}