"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Counts = {
  projects_total: number;
  submitted: number;
  pending: number;
  approved: number;
  rejected: number;
  fundable: number;
  funded_ugx: number;
};

type PageRow = { slug: string; title: string; updated_at: string | null };

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    projects_total: 0,
    submitted: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    fundable: 0,
    funded_ugx: 0,
  });

  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function loadCounts() {
    // Counts (fast + reliable)
    const count = async (filter?: { k: string; v: any }) => {
      let q = supabase.from("projects").select("id", { count: "exact", head: true });
      if (filter) q = q.eq(filter.k, filter.v);
      const { count, error } = await q;
      if (error) throw error;
      return count ?? 0;
    };

    const sumFunded = async () => {
      const { data, error } = await supabase.from("projects").select("funded_ugx");
      if (error) throw error;
      const total = (data ?? []).reduce((acc: number, r: any) => acc + Number(r.funded_ugx ?? 0), 0);
      return total;
    };

    const [projects_total, submitted, pending, approved, rejected, fundable, funded_ugx] = await Promise.all([
      count(),
      count({ k: "status", v: "submitted" }),
      count({ k: "status", v: "pending" }),
      count({ k: "status", v: "approved" }),
      count({ k: "status", v: "rejected" }),
      count({ k: "is_fundable", v: true }),
      sumFunded(),
    ]);

    setCounts({ projects_total, submitted, pending, approved, rejected, fundable, funded_ugx });
  }

  async function loadPages() {
    const { data, error } = await supabase.from("pages").select("slug,title,updated_at").order("slug", { ascending: true });
    if (error) throw error;
    setPages((data ?? []) as PageRow[]);
  }

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      await Promise.all([loadCounts(), loadPages()]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const fmtUGX = useMemo(() => {
    return (n: number) => `UGX ${Number(n || 0).toLocaleString("en-UG")}`;
  }, []);

  function Stat({ label, value, tone }: { label: string; value: string; tone?: "amber" | "emerald" | "red" }) {
    const cls =
      tone === "emerald"
        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
        : tone === "red"
        ? "bg-red-50 border-red-200 text-red-900"
        : tone === "amber"
        ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-white border-black/10 text-ink";
    return (
      <div className={`rounded-3xl border p-5 ${cls}`}>
        <div className="text-xs font-medium opacity-70">{label}</div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-mutedInk">Projects, members, and content management.</p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/admin/login";
          }}
          className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
        >
          Sign out
        </button>
      </div>

      {err ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div> : null}

      {/* KPIs */}
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Stat label="Total Projects" value={String(counts.projects_total)} />
        <Stat label="Submitted" value={String(counts.submitted)} tone="amber" />
        <Stat label="Approved" value={String(counts.approved)} tone="emerald" />
        <Stat label="Rejected" value={String(counts.rejected)} tone="red" />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Stat label="Pending review" value={String(counts.pending)} tone="amber" />
        <Stat label="Fundable projects" value={String(counts.fundable)} tone="emerald" />
        <Stat label="Total funded" value={fmtUGX(counts.funded_ugx)} />
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/admin/applications" className="rounded-3xl border border-black/10 bg-white p-6 hover:bg-black/[0.02]">
          <div className="text-sm font-semibold">Project Applications</div>
          <div className="mt-1 text-sm text-mutedInk">Review, approve/reject, and mark fundable.</div>
          <div className="mt-4 text-sm font-medium">Open →</div>
        </Link>

        <Link href="/admin/members" className="rounded-3xl border border-black/10 bg-white p-6 hover:bg-black/[0.02]">
          <div className="text-sm font-semibold">Member Management</div>
          <div className="mt-1 text-sm text-mutedInk">View members, statuses, and trigger password resets.</div>
          <div className="mt-4 text-sm font-medium">Open →</div>
        </Link>

        <Link href="/admin/pages/home" className="rounded-3xl border border-black/10 bg-white p-6 hover:bg-black/[0.02]">
          <div className="text-sm font-semibold">Content</div>
          <div className="mt-1 text-sm text-mutedInk">Edit website pages stored in Supabase.</div>
          <div className="mt-4 text-sm font-medium">Open →</div>
        </Link>
      </div>

      {/* Pages list */}
      <div className="mt-6 rounded-3xl border border-black/10 bg-white">
        <div className="border-b border-black/5 px-5 py-4 text-sm font-medium">All pages</div>

        {loading ? (
          <div className="px-5 py-6 text-sm text-mutedInk">Loading…</div>
        ) : (
          <div className="divide-y divide-black/5">
            {pages.map((r) => (
              <div key={r.slug} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="text-sm font-semibold">{r.title}</div>
                  <div className="text-xs text-mutedInk">/{r.slug}</div>
                </div>

                <Link
                  href={`/admin/pages/${encodeURIComponent(r.slug)}`}
                  className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}