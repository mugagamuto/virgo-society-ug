"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type PageRow = {
  slug: string;
  title: string;
  updated_at: string | null;
};

type Counts = { pending: number; approved: number; rejected: number; total: number };

export default function AdminDashboard() {
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [counts, setCounts] = useState<Counts>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [countsErr, setCountsErr] = useState<string | null>(null);

  async function loadCounts() {
    const q = async (status?: string) => {
      let query = supabase.from("support_applications").select("id", { count: "exact", head: true });
      if (status) query = query.eq("status", status);
      const { count, error } = await query;
      if (error) throw error;
      return count ?? 0;
    };
    const [pending, approved, rejected, total] = await Promise.all([q("pending"), q("approved"), q("rejected"), q()]);
    setCounts({ pending, approved, rejected, total });
  }

  async function loadPages() {
    const { data, error } = await supabase.from("pages").select("slug,title,updated_at").order("slug", { ascending: true });
    if (error) throw error;
    setRows((data ?? []) as PageRow[]);
  }

  async function load() {
    setLoading(true);
    setErr(null);
    setCountsErr(null);

    try {
      await Promise.all([loadPages(), loadCounts()]);
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load.";
      if (msg.toLowerCase().includes("support_applications")) setCountsErr(msg);
      else setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function Stat({ label, value, tone }: { label: string; value: number; tone?: "amber" | "emerald" | "red" }) {
    const cls =
      tone === "emerald" ? "bg-emerald-50 border-emerald-200 text-emerald-900"
      : tone === "red" ? "bg-red-50 border-red-200 text-red-900"
      : tone === "amber" ? "bg-amber-50 border-amber-200 text-amber-900"
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
          <p className="mt-1 text-sm text-mutedInk">Manage pages and member applications.</p>
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

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Support Applications</div>
            <div className="mt-1 text-sm text-mutedInk">Review uploaded documents and approve/reject.</div>
          </div>

          <Link href="/admin/applications" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            Open applications →
          </Link>
        </div>

        {countsErr ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{countsErr}</div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Stat label="Total" value={counts.total} />
            <Stat label="Pending" value={counts.pending} tone="amber" />
            <Stat label="Approved" value={counts.approved} tone="emerald" />
            <Stat label="Rejected" value={counts.rejected} tone="red" />
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white">
        <div className="border-b border-black/5 px-5 py-4 text-sm font-medium">All pages</div>

        {loading ? (
          <div className="px-5 py-6 text-sm text-mutedInk">Loading…</div>
        ) : err ? (
          <div className="px-5 py-6 text-sm text-red-700">{err}</div>
        ) : (
          <div className="divide-y divide-black/5">
            {rows.map((r) => (
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

      <div className="mt-4 text-xs text-mutedInk">
        Tip: If you don’t see pages here, run the optional seed insert statements in the SQL file.
      </div>
    </div>
  );
}

