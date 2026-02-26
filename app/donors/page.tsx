"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string;
  problem_summary: string;
  budget_ugx: number;
  status: string;
  created_at: string;
};

function fmt(n: number) {
  try { return new Intl.NumberFormat("en-UG").format(n); } catch { return String(n); }
}

export default function DonorsPage() {
  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  async function load() {
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("funding_projects")
      .select("id,title,problem_summary,budget_ugx,status,created_at")
      .in("status", ["open","pledged","funded"])
      .order("created_at", { ascending: false });

    if (error) { setErr(error.message); setLoading(false); return; }
    setRows((data ?? []) as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Fund a Project</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Browse verified community projects and express interest to fund. Our team will contact you to arrange support.
            </p>
          </div>
          <Link href="/" className="text-sm text-neutral-600 hover:underline">← Back to website</Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border p-6 text-sm text-neutral-600">Loading…</div>
        ) : err ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{err}</div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {rows.map((p) => (
              <Link key={p.id} href={`/donors/${p.id}`} className="rounded-3xl border p-6 shadow-sm hover:bg-neutral-50">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-semibold">{p.title}</div>
                  <span className="rounded-full border px-3 py-1 text-xs font-semibold">
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{p.problem_summary}</p>
                <div className="mt-4 text-sm font-semibold">Budget: UGX {fmt(p.budget_ugx)}</div>
                <div className="mt-2 text-xs text-neutral-500">Posted: {new Date(p.created_at).toLocaleDateString()}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
