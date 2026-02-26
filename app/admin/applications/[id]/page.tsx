"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type ProjectRow = {
  id: string;
  owner_id: string;
  owner_email: string | null;

  org_name: string | null;
  members_count: number | null;
  location: string | null;
  district: string | null;

  title: string;
  description: string;
  goals: string;
  stage: string;
  budget_ugx: number;

  status: string;
  submitted_at: string | null;
  admin_note: string | null;

  is_fundable: boolean;
  amount_raised_ugx: number;

  created_at: string;
  updated_at: string;
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
      : status === "pending" || status === "submitted"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-neutral-50 text-neutral-800 border-neutral-200";
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{status.toUpperCase()}</span>;
}

function fmtUGX(n: number) {
  return n.toLocaleString("en-UG");
}

export default function AdminProjectDetail({ params }: { params: { id: string } }) {
  const id = params.id;

  const [row, setRow] = useState<ProjectRow | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"draft" | "submitted" | "pending" | "approved" | "rejected">("pending");
  const [note, setNote] = useState("");
  const [fundable, setFundable] = useState(false);
  const [raised, setRaised] = useState<string>("0");

  async function load() {
    setLoading(true);
    setMsg(null);

    const { data: p, error: pErr } = await supabase.from("projects").select("*").eq("id", id).single();
    if (pErr) {
      setLoading(false);
      setMsg(pErr.message);
      return;
    }

    const proj = p as ProjectRow;
    setRow(proj);
    setStatus((proj.status as any) ?? "pending");
    setNote(proj.admin_note ?? "");
    setFundable(!!proj.is_fundable);
    setRaised(String(proj.amount_raised_ugx ?? 0));

    const { data: d, error: dErr } = await supabase
      .from("project_documents")
      .select("id,doc_type,file_path,original_name,created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    if (dErr) {
      setLoading(false);
      setMsg(dErr.message);
      return;
    }

    setDocs((d ?? []) as DocRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function viewDoc(path: string) {
    setMsg(null);
    const { data, error } = await supabase.storage.from("member-docs").createSignedUrl(path, 180);
    if (error) return setMsg(error.message);
    window.open(data.signedUrl, "_blank");
  }

  async function saveDecision() {
    if (!row) return;
    setMsg(null);

    const r = Number(raised);
    if (!Number.isFinite(r) || r < 0) return setMsg("Amount raised must be a number.");

    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        status,
        admin_note: note || null,
        is_fundable: fundable,
        amount_raised_ugx: r,
      })
      .eq("id", row.id);

    setSaving(false);
    if (error) return setMsg(error.message);

    setMsg("✅ Updated successfully.");
    load();
  }

  async function sendResetEmail() {
    if (!row) return;
    setMsg(null);

    const email = row.owner_email;
    if (!email) {
      setMsg("No owner email saved for this project yet. Member should re-save the project so owner_email is stored.");
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "https://vigosociety.org";
    const redirectTo = `${origin}/members/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return setMsg(error.message);

    setMsg(`✅ Password reset email sent to ${email}.`);
  }

  const Field = ({ label, value }: { label: string; value: any }) => (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-xs font-medium text-mutedInk">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink whitespace-pre-wrap">{value || "—"}</div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Project Review</h1>
            {row ? <StatusPill status={row.status} /> : null}
          </div>
          <p className="mt-1 text-sm text-mutedInk">Approve/reject and optionally list on Fund a Project.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/applications" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            ← Back
          </Link>
          <button onClick={load} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
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
              <div className="text-sm font-semibold">Project details</div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Field label="Organisation" value={row.org_name} />
                <Field label="Owner email" value={row.owner_email} />
                <Field label="Members count" value={row.members_count} />
                <Field label="Location" value={`${row.location ?? "—"}${row.district ? ` • ${row.district}` : ""}`} />

                <Field label="Title" value={row.title} />
                <Field label="Stage" value={row.stage} />

                <div className="md:col-span-2">
                  <Field label="Description" value={row.description} />
                </div>
                <div className="md:col-span-2">
                  <Field label="Goals & objectives" value={row.goals} />
                </div>

                <Field label="Budget (UGX)" value={`UGX ${fmtUGX(row.budget_ugx)}`} />
                <Field label="Raised (UGX)" value={`UGX ${fmtUGX(row.amount_raised_ugx ?? 0)}`} />
              </div>

              <div className="mt-4 text-xs text-mutedInk">
                Submitted: {row.submitted_at ? new Date(row.submitted_at).toLocaleString() : "Not submitted"} • Created:{" "}
                {new Date(row.created_at).toLocaleString()}
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
                  <option value="submitted">Submitted</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="mt-4">
                <div className="text-xs font-medium text-mutedInk">Admin note</div>
                <textarea
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
                  rows={5}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason / next steps…"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">List on Fund a Project</div>
                  <input type="checkbox" checked={fundable} onChange={(e) => setFundable(e.target.checked)} />
                </div>

                <div className="mt-3">
                  <div className="text-xs font-medium text-mutedInk">Amount raised (UGX)</div>
                  <input
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
                    value={raised}
                    onChange={(e) => setRaised(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <button
                onClick={saveDecision}
                disabled={saving}
                className="mt-4 w-full rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save decision"}
              </button>

              <button
                onClick={sendResetEmail}
                className="mt-3 w-full rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]"
              >
                Send password reset email
              </button>

              <p className="mt-2 text-xs text-mutedInk">
                Admins cannot view passwords. This sends a secure reset link to the member.
              </p>
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
