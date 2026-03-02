"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Member = { id: string; email: string | null; full_name: string | null; status: string | null; created_at: string };

async function safeJson(res: Response) {
  const t = await res.text();
  try { return { json: JSON.parse(t), text: t }; } catch { return { json: null as any, text: t }; }
}

export default function AdminMembersPage() {
  const [rows, setRows] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/members", { cache: "no-store" });
    const { json, text } = await safeJson(res);
    if (!json) { setMsg(`Non-JSON (${res.status}): ${text.slice(0,200)}`); setRows([]); setLoading(false); return; }
    if (!res.ok || !json.ok) { setMsg(json?.error?.message ?? json?.error ?? "Failed"); setRows([]); setLoading(false); return; }
    setRows(json.data ?? []);
    setLoading(false);
  }

  async function setStatus(id: string, status: string) {
    setMsg(null);
    const res = await fetch("/api/admin/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const { json, text } = await safeJson(res);
    if (!json) return setMsg(`Non-JSON (${res.status}): ${text.slice(0,200)}`);
    if (!res.ok || !json.ok) return setMsg(json?.error?.message ?? json?.error ?? "Update failed");
    setMsg("Updated ✅");
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Members</h1>
          <p className="mt-1 text-sm text-mutedInk">View members and activate/suspend accounts.</p>
        </div>
        <Link href="/admin" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]">← Back</Link>
      </div>

      {msg ? <div className="rounded-2xl border border-black/10 bg-white p-3 text-sm">{msg}</div> : null}

      <div className="rounded-3xl border border-black/10 bg-white p-5">
        {loading ? (
          <div className="text-sm text-mutedInk">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-mutedInk">No members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-mutedInk">
                <tr>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Joined</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-t border-black/5">
                    <td className="py-3">{m.full_name ?? "—"}</td>
                    <td className="py-3">{m.email ?? "—"}</td>
                    <td className="py-3">{m.status ?? "—"}</td>
                    <td className="py-3">{m.created_at ? new Date(m.created_at).toLocaleString() : ""}</td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => setStatus(m.id, "active")} className="rounded-xl bg-emerald-700 px-3 py-2 text-white font-semibold hover:bg-emerald-800">Activate</button>
                      <button onClick={() => setStatus(m.id, "suspended")} className="rounded-xl bg-red-600 px-3 py-2 text-white font-semibold hover:bg-red-700">Suspend</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <button onClick={load} className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]">Refresh</button>
        </div>
      </div>
    </div>
  );
}