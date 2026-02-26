"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Project = {
  id: string;
  org_name: string | null;
  location: string | null;
  district: string | null;
  project_title: string | null;
  project_description: string | null;
  project_goals: string | null;
  project_stage: string | null;
  project_budget_ugx: number | null;
  amount_raised_ugx: number | null;
};

function fmtUGX(n: number) {
  return n.toLocaleString("en-UG");
}

export default function DonorsPage() {
  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("fundable_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    setRows((data ?? []) as Project[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const content = useMemo(() => {
    if (loading) return <div className="rounded-3xl border p-6 text-sm text-neutral-600">Loading…</div>;
    if (err) return <div className="rounded-3xl border p-6 text-sm text-red-700">{err}</div>;
    if (rows.length === 0) return <div className="rounded-3xl border p-6 text-sm text-neutral-600">No projects available yet.</div>;

    return (
      <div className="grid gap-5 md:grid-cols-2">
        {rows.map((p) => {
          const goal = p.project_budget_ugx ?? 0;
          const raised = p.amount_raised_ugx ?? 0;
          const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

          return (
            <div key={p.id} className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-xs text-neutral-500">
                {(p.location ?? "—")}{p.district ? ` • ${p.district}` : ""} {p.org_name ? ` • ${p.org_name}` : ""}
              </div>
              <h3 className="mt-1 text-lg font-semibold">{p.project_title ?? "Project"}</h3>

              <div className="mt-2 text-sm text-neutral-700 line-clamp-3">
                {p.project_description ?? "—"}
              </div>

              <div className="mt-3 grid gap-2 text-xs text-neutral-600">
                <div><span className="font-semibold">Stage:</span> {p.project_stage ?? "—"}</div>
                <div className="line-clamp-2"><span className="font-semibold">Goals:</span> {p.project_goals ?? "—"}</div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Raised: UGX {fmtUGX(raised)}</span>
                  <span>Budget: UGX {fmtUGX(goal)}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-black/10">
                  <div className="h-2 rounded-full bg-emerald-700" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 text-xs text-neutral-500">{pct}% funded</div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/donors/${p.id}`}
                  className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  View & fund
                </Link>
                <Link
                  href="/donate"
                  className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.03]"
                >
                  Donate to organization
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [loading, err, rows]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Fund a Project</h1>
            <p className="mt-1 text-sm text-neutral-600">
              View approved projects, their objectives, stage, and budgets.
            </p>
          </div>
          <Link href="/" className="text-sm text-neutral-600 hover:underline">← Back</Link>
        </div>

        <div className="mt-8">{content}</div>
      </div>
    </main>
  );
}