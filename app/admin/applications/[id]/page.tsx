"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ApiOk = { ok: true; application: any; project: any; documents: any[] };
type ApiErr = { ok: false; error: any };
type ApiResp = ApiOk | ApiErr;

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return { json: JSON.parse(text), text };
  } catch {
    return { json: null as any, text };
  }
}

export default function AdminApplicationDetail() {
  const params = useParams();
  const id =
    typeof (params as any)?.id === "string"
      ? ((params as any).id as string)
      : Array.isArray((params as any)?.id)
      ? (((params as any).id as string[])[0] ?? "")
      : "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [data, setData] = useState<{ application: any; project: any; documents: any[] } | null>(null);

  async function load(appId: string) {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/applications/${encodeURIComponent(appId)}`, { cache: "no-store" });
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
    if (!id) return;
    setMsg(null);

    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}/approve`, { method: "POST" });
    const { json, text } = await safeJson(res);
    if (!json) return setMsg(`Approve API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
    if (!res.ok || !json.ok) return setMsg(json?.error?.message ?? json?.error ?? "Approve failed");

    setMsg("Approved & published.");
    await load(id);
  }

  async function reject() {
    if (!id) return;
    setMsg(null);

    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}/reject`, { method: "POST" });
    const { json, text } = await safeJson(res);
    if (!json) return setMsg(`Reject API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
    if (!res.ok || !json.ok) return setMsg(json?.error?.message ?? json?.error ?? "Reject failed");

    setMsg("Rejected.");
    await load(id);
  }

  async function openDoc(filePath: string) {
    try {
      const res = await fetch(`/api/admin/doc-url?path=${encodeURIComponent(filePath)}`, { cache: "no-store" });
      const { json, text } = await safeJson(res);
      if (!json) throw new Error(`doc-url returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
      if (!res.ok || !json.ok) throw new Error(json?.error?.message ?? json?.error ?? "Failed to create link");
      window.open(json.signedUrl, "_blank");
    } catch (e: any) {
      setMsg(e?.message ?? "Failed to open document.");
    }
  }

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setErr("Missing application id in URL.");
      return;
    }
    load(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Application Review</h1>
          <p className="text-sm text-mutedInk">Verify documents then approve to publish on Fund a Project.</p>
          <div className="mt-1 text-xs text-mutedInk">ID: {id || "—"}</div>
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
                <button onClick={() => load(id)} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]">
                  Refresh
                </button>
              </div>
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

                    <div className="flex items-center gap-3">
                      <div className="text-xs text-mutedInk">
                        {d.created_at ? new Date(d.created_at).toLocaleString() : ""}
                      </div>
                      <button
                        className="rounded-xl border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/[0.03]"
                        onClick={() => {
                          const p = d.file_path as string;
                          if (!p) return setMsg("Missing file_path for this document.");
                          openDoc(p);
                        }}
                      >
                        View / Download
                      </button>
                    </div>
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