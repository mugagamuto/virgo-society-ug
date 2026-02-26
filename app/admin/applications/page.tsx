"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Row = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  district: string | null;
  status: string;
  submitted_at: string | null;
  created_at: string;
};

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "approved"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "rejected"
      ? "bg-red-50 text-red-800 border-red-200"
      : "bg-amber-50 text-amber-800 border-amber-200";
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{status.toUpperCase()}</span>;
}

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [status, setStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!qq) return true;
      const blob = `${r.email ?? ""} ${r.full_name ?? ""} ${r.phone ?? ""} ${r.location ?? ""} ${r.district ?? ""}`.toLowerCase();
      return blob.includes(qq);
    });
  }, [rows, status, q]);

  async function load() {
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("support_applications")
      .select("id,email,full_name,phone,location,district,status,submitted_at,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    setRows((data ?? []) as Row[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-mutedInk">Open a record to view documents and update status.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/admin" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            ← Back
          </Link>
          <button
            onClick={load}
            className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs font-medium text-mutedInk">Status</div>
            <select
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-medium text-mutedInk">Search</div>
            <input
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm"
              placeholder="Search name, email, phone, location…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-black/10 bg-white">
        <div className="border-b border-black/5 px-5 py-4 text-sm font-medium">
          Applications • {filtered.length}
        </div>

        {loading ? (
          <div className="px-5 py-6 text-sm text-mutedInk">Loading…</div>
        ) : err ? (
          <div className="px-5 py-6 text-sm text-red-700">{err}</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-6 text-sm text-mutedInk">No applications found.</div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm font-semibold">{r.full_name ?? "—"}</div>
                    <StatusPill status={r.status} />
                    {r.submitted_at ? (
                      <span className="text-xs text-mutedInk">Submitted</span>
                    ) : (
                      <span className="text-xs text-mutedInk">Draft</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-mutedInk">
                    {r.email ?? "—"} • {r.phone ?? "—"} • {r.location ?? "—"} {r.district ? `• ${r.district}` : ""}
                  </div>
                </div>

                <Link
                  href={`/admin/applications/${r.id}`}
                  className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
                >
                  Open →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
