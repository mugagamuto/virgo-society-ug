"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type AppRow = {
  id: string;
  status: string;
  created_at: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
};

const STATUSES = ["all", "pending", "approved", "rejected"] as const;
type StatusFilter = (typeof STATUSES)[number];

export default function AdminApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<AppRow[]>([]);
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const hay = `${r.full_name ?? ""} ${r.phone ?? ""} ${r.email ?? ""} ${r.id}`.toLowerCase();
      return hay.includes(s);
    });
  }, [rows, q]);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      let query = supabase
        .from("support_applications")
        .select("id,status,created_at,full_name,phone,email")
        .order("created_at", { ascending: false });

      if (status !== "all") query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;

      setRows((data ?? []) as AppRow[]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Support Applications</h1>
          <p className="mt-1 text-sm text-mutedInk">Review uploaded documents and approve/reject.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            ← Back to dashboard
          </Link>

          <button
            onClick={load}
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold">Filter</div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-2xl border px-3 py-1.5 text-sm ${
                    status === s
                      ? "border-black/20 bg-black/[0.03] font-medium"
                      : "border-black/10 hover:bg-black/[0.03]"
                  }`}
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / phone / email…"
            className="w-full md:w-[320px] rounded-2xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/20"
          />
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-mutedInk">Loading…</div>
        ) : err ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {err}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-4 text-sm text-mutedInk">No applications found.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-mutedInk">
                  <th className="py-2 pr-4">Submitted</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-0 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 pr-4 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="py-3 pr-4">{r.full_name ?? "—"}</td>
                    <td className="py-3 pr-4">{r.phone ?? "—"}</td>
                    <td className="py-3 pr-4">{r.email ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-xl border border-black/10 px-2 py-1 text-xs">{r.status}</span>
                    </td>
                    <td className="py-3 pr-0 text-right">
                      <Link
                        href={`/admin/applications/${encodeURIComponent(r.id)}`}
                        className="rounded-2xl border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/[0.03]"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
