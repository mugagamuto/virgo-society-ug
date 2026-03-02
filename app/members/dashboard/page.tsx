"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string | null;
  status: string | null;
  is_fundable: boolean | null;
  created_at: string;
  updated_at: string | null;
  goal_ugx?: number | null;
  funded_ugx?: number | null;
  budget_ugx?: number | null;
};

export default function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const { data: sess, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      const token = sess?.session?.access_token;
      if (!token) throw new Error("You are not logged in. Please log in again.");

      const res = await fetch("/api/members/projects", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch { throw new Error(`API returned non-JSON (${res.status}). ${text.slice(0, 200)}`); }

      if (!res.ok || !json.ok) {
        throw new Error(json?.error?.message ?? json?.error ?? `HTTP ${res.status}`);
      }

      setProjects((json.data ?? []) as Project[]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Member Projects</h1>
          <p className="mt-1 text-sm text-mutedInk">Create multiple projects, upload documents, and submit each for review.</p>
        </div>
        <Link href="/" className="text-sm font-medium hover:underline">← Back</Link>
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        {loading ? (
          <div className="text-sm text-mutedInk">Loading…</div>
        ) : err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>
        ) : projects.length === 0 ? (
          <div className="text-sm text-mutedInk">No projects yet.</div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{p.title ?? "Untitled project"}</div>
                    <div className="mt-1 text-xs text-mutedInk">
                      Status: {p.status ?? "—"} • Fundable: {p.is_fundable ? "Yes" : "No"}
                    </div>
                  </div>
                  <Link
                    href={`/members/projects/${encodeURIComponent(p.id)}`}
                    className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button onClick={load} className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}