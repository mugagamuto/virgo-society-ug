"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type AppRow = {
  id: string;
  user_id: string;
  status: string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;

  org_name: string | null;
  members_count: number | null;

  full_name: string | null;
  nin: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  district: string | null;
  address: string | null;
};

type DocRow = {
  id: string;
  doc_type: string;
  file_path: string;
  original_name: string | null;
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

export default function AdminApplicationDetail({ params }: { params: { id: string } }) {
  const id = params.id;

  const [row, setRow] = useState<AppRow | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [note, setNote] = useState("");

  async function load() {
    setLoading(true);
    setMsg(null);

    const { data: app, error: appErr } = await supabase
      .from("support_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (appErr) {
      setLoading(false);
      setMsg(appErr.message);
      return;
    }

    setRow(app as AppRow);
    setStatus(((app as any).status ?? "pending") as any);
    setNote((app as any).admin_note ?? "");

    const { data: docRows, error: docErr } = await supabase
      .from("application_documents")
      .select("id,doc_type,file_path,original_name,created_at")
      .eq("application_id", id)
      .order("created_at", { ascending: false });

    if (docErr) {
      setLoading(false);
      setMsg(docErr.message);
      return;
    }

    setDocs((docRows ?? []) as DocRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function viewDoc(path: string) {
    setMsg(null);
    const { data, error } = await supabase.storage.from("member-docs").createSignedUrl(path, 120);
    if (error) return setMsg(error.message);
    window.open(data.signedUrl, "_blank");
  }

  async function saveStatus() {
    if (!row) return;
    setSaving(true);
    setMsg(null);

    const { error } = await supabase
      .from("support_applications")
      .update({ status, admin_note: note })
      .eq("id", row.id);

    setSaving(false);
    if (error) return setMsg(error.message);

    setMsg("✅ Updated successfully.");
    load();
  }

  const Field = ({ label, value }: { label: string; value: any }) => (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-xs font-medium text-mutedInk">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value || "—"}</div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Application</h1>
            {row ? <StatusPill status={row.status} /> : null}
          </div>
          <p className="mt-1 text-sm text-mutedInk">Review details, view documents, approve/reject.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/applications" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
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

      {loading ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white px-5 py-6 text-sm text-mutedInk">Loading…</div>
      ) : msg ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white px-5 py-4 text-sm">{msg}</div>
      ) : null}

      {row ? (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-black/10 bg-white p-5 lg:col-span-2">
              <div className="text-sm font-semibold">Registration / Applicant details</div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Field label="Organisation name" value={row.org_name} />
                <Field label="Members count" value={row.members_count} />
                <Field label="Contact name" value={row.full_name} />
                <Field label="Email" value={row.email} />
                <Field label="Phone" value={row.phone} />
                <Field label="NIN" value={row.nin} />
                <Field label="Location" value={row.location} />
                <Field label="District" value={row.district} />
                <Field label="Address" value={row.address} />
              </div>

              <div className="mt-4 text-xs text-mutedInk">
                Submitted: {row.submitted_at ? new Date(row.submitted_at).toLocaleString() : "Not yet"} •
                Created: {new Date(row.created_at).toLocaleString()}
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5">
              <div className="text-sm font-semibold">Decision</div>

              <div className="mt-4">
                <div className="text-xs font-medium text-mutedInk">Status</div>
                <select
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mt-4">
                <div className="text-xs font-medium text-mutedInk">Admin note (optional)</div>
                <textarea
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
                  rows={5}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason / next steps…"
                />
              </div>

              <button
                onClick={saveStatus}
                disabled={saving}
                className="mt-4 w-full rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save decision"}
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-black/10 bg-white">
            <div className="border-b border-black/5 px-5 py-4 text-sm font-medium">Uploaded documents</div>

            {docs.length === 0 ? (
              <div className="px-5 py-6 text-sm text-mutedInk">No documents uploaded yet.</div>
            ) : (
              <div className="divide-y divide-black/5">
                {docs.map((d) => (
                  <div key={d.id} className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-semibold">{d.doc_type}</div>
                      <div className="text-xs text-mutedInk">
                        {d.original_name ?? d.file_path} • {new Date(d.created_at).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => viewDoc(d.file_path)}
                      className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
