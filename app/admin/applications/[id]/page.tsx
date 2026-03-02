"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type ApiOk = { ok: true; application: any; project: any; documents: any[] };
type ApiErr = { ok: false; error: any };
type ApiResp = ApiOk | ApiErr;

async function safeJson(res: Response) {
  const text = await res.text();
  try { return { json: JSON.parse(text), text }; } catch { return { json: null as any, text }; }
}

function fmtUgx(n?: number | null) {
  if (n === null || n === undefined) return "UGX 0";
  return `UGX ${Number(n).toLocaleString()}`;
}

export default function AdminApplicationDetail() {
  const params = useParams();
  const raw = (params as any)?.id;
  const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [data, setData] = useState<{ application: any; project: any; documents: any[] } | null>(null);

  const budget = useMemo(() => {
    const bb = data?.project?.budget_breakdown;
    if (!bb) return [];
    try { return Array.isArray(bb) ? bb : JSON.parse(bb); } catch { return []; }
  }, [data]);

  async function load() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, { cache: "no-store" });
      const { json, text } = await safeJson(res);
      if (!json) throw new Error(`API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);

      const payload = json as ApiResp;
      if (!res.ok || !payload.ok) {
        const m = (payload as any)?.error?.message ?? (payload as any)?.error ?? `HTTP ${res.status}`;
        throw new Error(m);
      }

      setData({ application: payload.application, project: payload.project, documents: payload.documents ?? [] });
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function approve() {
    setMsg(null);
    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}/approve`, { method: "POST" });
    const { json, text } = await safeJson(res);
    if (!json) return setMsg(`Approve API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
    if (!res.ok || !json.ok) return setMsg(json?.error?.message ?? json?.error ?? "Approve failed");
    setMsg("Approved & published.");
    await load();
  }

  async function reject() {
    setMsg(null);
    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}/reject`, { method: "POST" });
    const { json, text } = await safeJson(res);
    if (!json) return setMsg(`Reject API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
    if (!res.ok || !json.ok) return setMsg(json?.error?.message ?? json?.error ?? "Reject failed");
    setMsg("Rejected.");
    await load();
  }

  async function openDoc(path: string) {
    try {
      const res = await fetch(`/api/admin/doc-url?path=${encodeURIComponent(path)}`, { cache: "no-store" });
      const { json, text } = await safeJson(res);
      if (!json) throw new Error(`doc-url returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
      if (!res.ok || !json.ok) throw new Error(json?.error?.message ?? json?.error ?? "Failed to create link");
      window.open(json.signedUrl, "_blank");
    } catch (e: any) {
      setMsg(e?.message ?? "Failed to open document.");
    }
  }

  useEffect(() => { if (id) load(); }, [id]);

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project Review</h1>
          <p className="text-sm text-mutedInk">Verify details + documents, then approve to publish.</p>
          <div className="mt-1 text-xs text-mutedInk">Application ID: {id || "—"}</div>
        </div>
        <Link href="/admin/applications" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
          ← Back
        </Link>
      </div>

      {msg ? <div className="rounded-2xl border border-black/10 bg-white p-3 text-sm">{msg}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-mutedInk">Loading…</div>
      ) : err ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{err}</div>
      ) : !data ? (
        <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-mutedInk">No data.</div>
      ) : (
        <>
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold">Status: {data.application?.status ?? "pending"}</div>
              <div className="flex gap-2">
                <button onClick={approve} className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                  Approve + Publish
                </button>
                <button onClick={reject} className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  Reject
                </button>
                <button onClick={load} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]">
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Applicant</div>
                <div className="mt-1 text-sm font-medium">{data.application?.full_name ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Email</div>
                <div className="mt-1 text-sm font-medium">{data.application?.email ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Phone</div>
                <div className="mt-1 text-sm font-medium">{data.application?.phone ?? "—"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Project details</div>
            {data.project ? (
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="font-medium">Title:</span> {data.project.title ?? "—"}</div>
                <div><span className="font-medium">Org:</span> {data.project.org_name ?? "—"} • <span className="font-medium">District:</span> {data.project.district ?? "—"}</div>
                <div><span className="font-medium">Stage:</span> {data.project.stage ?? "—"} • <span className="font-medium">Status:</span> {data.project.status ?? "—"}</div>
                <div className="grid gap-3 md:grid-cols-3 mt-3">
                  <div className="rounded-2xl border border-black/10 p-3"><div className="text-xs text-mutedInk">Goal</div><div className="mt-1 font-semibold">{fmtUgx(data.project.goal_ugx)}</div></div>
                  <div className="rounded-2xl border border-black/10 p-3"><div className="text-xs text-mutedInk">Budget</div><div className="mt-1 font-semibold">{fmtUgx(data.project.budget_ugx)}</div></div>
                  <div className="rounded-2xl border border-black/10 p-3"><div className="text-xs text-mutedInk">Raised</div><div className="mt-1 font-semibold">{fmtUgx(data.project.funded_ugx)}</div></div>
                </div>

                {data.project.description ? <div className="mt-3"><span className="font-medium">Description:</span> {data.project.description}</div> : null}
                {data.project.goals ? <div><span className="font-medium">Goals:</span> {data.project.goals}</div> : null}
              </div>
            ) : (
              <div className="mt-2 text-sm text-mutedInk">No linked project found (check support_applications.project_id).</div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Public proposal</div>
            <div className="mt-2 text-sm text-mutedInk whitespace-pre-wrap">{data.project?.proposal_text ?? "—"}</div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Public budget breakdown</div>
            {budget.length ? (
              <div className="mt-3 space-y-2">
                {budget.map((b: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between rounded-2xl border border-black/10 p-3">
                    <div className="text-sm font-medium">{b.item ?? "Item"}</div>
                    <div className="text-sm font-semibold">{fmtUgx(b.amount_ugx ?? 0)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-sm text-mutedInk">No budget breakdown provided.</div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Supporting documents (admin-only)</div>
            {data.documents?.length ? (
              <div className="mt-3 space-y-2">
                {data.documents.map((d: any) => (
                  <div key={d.id ?? d.file_path} className="flex items-center justify-between rounded-2xl border border-black/10 p-3">
                    <div>
                      <div className="text-sm font-medium">{d.doc_type ?? "document"}</div>
                      <div className="text-xs text-mutedInk">{d.original_name ?? d.file_path ?? "—"}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-mutedInk">{d.created_at ? new Date(d.created_at).toLocaleString() : ""}</div>
                      <button
                        className="rounded-xl border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/[0.03]"
                        onClick={() => d.file_path ? openDoc(d.file_path) : setMsg("Missing file_path for this document.")}
                      >
                        View / Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-sm text-mutedInk">No documents found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}