"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";

type Row = any;

async function safeJson(res: Response) {
  const t = await res.text();
  try { return { json: JSON.parse(t), text: t }; } catch { return { json: null as any, text: t }; }
}

function fmtUgx(n?: number | null) {
  if (n === null || n === undefined) return "UGX 0";
  return `UGX ${Number(n).toLocaleString()}`;
}

export default function AdminDonationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/admin/donations", { cache: "no-store" });
    const { json, text } = await safeJson(res);

    if (!json) { setMsg(`Non-JSON (${res.status}): ${text.slice(0,200)}`); setRows([]); setLoading(false); return; }
    if (!res.ok || !json.ok) { setMsg(json?.error?.message ?? json?.error ?? "Failed"); setRows([]); setLoading(false); return; }

    setRows(json.data ?? []);
    setLoading(false);
  }

  const totals = useMemo(() => {
    const map = new Map<string, { title: string; total: number }>();
    for (const r of rows) {
      const pid = r.project_id;
      const title = r?.projects?.title ?? "Project";
      const prev = map.get(pid) ?? { title, total: 0 };
      prev.total += Number(r.amount_ugx ?? 0);
      map.set(pid, prev);
    }
    return Array.from(map.entries()).map(([project_id, v]) => ({ project_id, ...v })).sort((a,b)=>b.total-a.total);
  }, [rows]);

  useEffect(() => { load(); }, []);

  return (
    <AdminGuard>
      <div className="max-w-6xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Donations / Funding</h1>
            <p className="mt-1 text-sm text-mutedInk">Track pledges and totals per project.</p>
          </div>
          <Link href="/admin" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]">← Back</Link>
        </div>

        {msg ? <div className="rounded-2xl border border-black/10 bg-white p-3 text-sm">{msg}</div> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Totals by project</div>
            {loading ? <div className="mt-3 text-sm text-mutedInk">Loading…</div> : totals.length === 0 ? (
              <div className="mt-3 text-sm text-mutedInk">No donations yet.</div>
            ) : (
              <div className="mt-3 space-y-2">
                {totals.map((t) => (
                  <div key={t.project_id} className="flex items-center justify-between rounded-2xl border border-black/10 p-3">
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="text-sm font-semibold">{fmtUgx(t.total)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Recent donations</div>
              <button onClick={load} className="rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold hover:bg-black/[0.03]">Refresh</button>
            </div>

            {loading ? <div className="mt-3 text-sm text-mutedInk">Loading…</div> : rows.length === 0 ? (
              <div className="mt-3 text-sm text-mutedInk">No donations yet.</div>
            ) : (
              <div className="mt-3 space-y-2">
                {rows.slice(0, 12).map((r) => (
                  <div key={r.id} className="rounded-2xl border border-black/10 p-3">
                    <div className="text-sm font-semibold">{r?.projects?.title ?? "Project"} • {fmtUgx(r.amount_ugx)}</div>
                    <div className="mt-1 text-xs text-mutedInk">
                      Ref: {r.reference ?? "—"} • {r.status ?? "pending"} • {r.payment_method ?? "—"} • {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                    </div>
                    <div className="mt-1 text-xs text-mutedInk">
                      Donor: {r.donor_name ?? "—"} • {r.donor_phone ?? "—"} • {r.donor_email ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}