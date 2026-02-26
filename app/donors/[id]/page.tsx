"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
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

export default function DonorProjectDetail({ params }: { params: { id: string } }) {
  const id = params.id;
  const [p, setP] = useState<Project | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const { data, error } = await supabase.from("fundable_projects").select("*").eq("id", id).maybeSingle();
    if (error) return setErr(error.message);
    setP((data ?? null) as Project | null);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (err) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-3xl border p-6 text-sm text-red-700">{err}</div>
          <Link href="/donors" className="mt-4 inline-block text-sm text-neutral-600 hover:underline">← Back to projects</Link>
        </div>
      </main>
    );
  }

  if (!p) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-3xl border p-6 text-sm text-neutral-600">Loading…</div>
        </div>
      </main>
    );
  }

  const goal = p.project_budget_ugx ?? 0;
  const raised = p.amount_raised_ugx ?? 0;
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/donors" className="text-sm text-neutral-600 hover:underline">← Back to projects</Link>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-xs text-neutral-500">
            {(p.location ?? "—")}{p.district ? ` • ${p.district}` : ""} {p.org_name ? ` • ${p.org_name}` : ""}
          </div>
          <h1 className="mt-1 text-2xl font-semibold">{p.project_title ?? "Project"}</h1>

          <div className="mt-4 grid gap-4">
            <div>
              <div className="text-sm font-semibold">Description</div>
              <div className="mt-1 text-sm text-neutral-700 whitespace-pre-wrap">{p.project_description ?? "—"}</div>
            </div>

            <div>
              <div className="text-sm font-semibold">Goals & objectives</div>
              <div className="mt-1 text-sm text-neutral-700 whitespace-pre-wrap">{p.project_goals ?? "—"}</div>
            </div>

            <div>
              <div className="text-sm font-semibold">Stage reached</div>
              <div className="mt-1 text-sm text-neutral-700">{p.project_stage ?? "—"}</div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Raised: UGX {fmtUGX(raised)}</span>
                <span>Budget: UGX {fmtUGX(goal)}</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-black/10">
                <div className="h-2 rounded-full bg-emerald-700" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-xs text-neutral-500">{pct}% funded</div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="text-sm font-semibold">How to fund this project</div>
              <div className="mt-2 text-sm text-neutral-600">
                For now, fund via Mobile Money / Bank Transfer and then contact us to confirm.
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-sm font-semibold">Mobile Money (UG)</div>
                  <div className="mt-2 text-sm text-neutral-600">MTN: ____________</div>
                  <div className="text-sm text-neutral-600">Airtel: ____________</div>
                </div>

                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-sm font-semibold">Bank Transfer</div>
                  <div className="mt-2 text-sm text-neutral-600">Bank: ____________</div>
                  <div className="text-sm text-neutral-600">A/C Name: Virgo Building Society</div>
                  <div className="text-sm text-neutral-600">A/C No: ____________</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                  Contact to confirm
                </Link>
                <Link href="/donate" className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.03]">
                  Donate to organization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 