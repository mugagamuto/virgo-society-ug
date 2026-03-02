"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ApiResp =
  | { ok: true; application: any; project: any; documents: any[] }
  | { ok: false; error: any };

export default function AdminApplicationDetail({ params }: { params: { id: string } }) {
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<{ application: any; project: any; documents: any[] } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, { cache: "no-store" });
      const json = (await res.json()) as ApiResp;
      if (!json.ok) throw new Error(typeof json.error === "string" ? json.error : (json.error?.message ?? "Failed"));
      setData({ application: json.application, project: json.project, documents: json.documents ?? [] });
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
    const json = await res.json();
    if (!json.ok) return setMsg(json?.error?.message ?? "Approve failed");
    setMsg("Approved & published.");
    await load();
  }

  async function reject() {
    setMsg(null);
    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}/reject`, { method: "POST" });
    const json = await res.json();
    if (!json.ok) return setMsg(json?.error?.message ?? "Reject failed");
    setMsg("Rejected.");
    await load();
  }

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Application Review</h1>
          <p className="text-sm text-mutedInk">Verify documents then approve to publish on Fund a Project.</p>
          <div className="mt-1 text-xs text-mutedInk">ID: {id ?? "—"}</div>
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
        <div className="space-y-4">
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold">
                Status: <span className="font-medium">{data.application?.status ?? "pending"}</span>
              </div>
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
            <div className="text-sm font-semibold">Project</div>
            <div className="mt-2 text-sm text-mutedInk">
              {data.project ? (
                <>
                  <div><span className="font-medium">Title:</span> {data.project?.title ?? data.application?.project_title ?? "—"}</div>
                  <div><span className="font-medium">Budget:</span> {data.project?.budget_ugx ?? data.application?.project_budget_ugx ?? "—"}</div>
                  <div><span className="font-medium">Stage:</span> {data.project?.stage ?? data.application?.project_stage ?? "—"}</div>
                </>
              ) : (
                <>No linked project found (check support_applications.project_id).</>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Documents</div>
            {data.documents?.length ? (
              <div className="mt-3 space-y-2">
                {data.documents.map((d: any) => (
                  <div key={d.id ?? d.file_path} className="flex items-center justify-between rounded-2xl border border-black/10 p-3">
                    <div>
                      <div className="text-sm font-medium">{d.doc_type ?? "document"}</div>
                      <div className="text-xs text-mutedInk">{d.original_name ?? d.file_path ?? "—"}</div>
                    </div>
                    <div className="text-xs text-mutedInk">{d.created_at ? new Date(d.created_at).toLocaleString() : ""}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-sm text-mutedInk">No documents found for this project.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}