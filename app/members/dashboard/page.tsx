"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

type AppRow = {
  id: string;
  status: "pending" | "approved" | "rejected" | string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
};

type DocRow = {
  id: string;
  doc_type: string;
  file_path: string;
  original_name: string | null;
  created_at: string;
};

const DOC_TYPES = [
  { value: "registration_form", label: "Registration Form (Scanned PDF/Image)" },
  { value: "registration_documents", label: "Registration Documents (Certificate/Bylaws/Minutes)" },
  { value: "nin", label: "NIN / ID (Contact Person)" },
  { value: "photo", label: "Passport Photo" },
  { value: "other", label: "Other Supporting Document" },
] as const;

const REQUIRED_DOCS = ["registration_form", "registration_documents", "nin", "photo"] as const;

function hasRequiredDocs(docs: { doc_type: string }[]) {
  const types = new Set(docs.map((d) => d.doc_type));
  return REQUIRED_DOCS.every((t) => types.has(t));
}

function Badge({ status }: { status: string }) {
  const cls =
    status === "approved"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "rejected"
      ? "bg-red-50 text-red-800 border-red-200"
      : "bg-amber-50 text-amber-800 border-amber-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [appRow, setAppRow] = useState<AppRow | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);

  const [docType, setDocType] = useState<(typeof DOC_TYPES)[number]["value"]>("registration_form");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Always available: print-friendly HTML (users can Print → Save PDF)
  const printableHtmlUrl = "/forms/support-application";
  // ✅ Optional: if you upload a real PDF later, this will work too
  const pdfUrl = "/forms/support-application";

  const readyToSubmit = useMemo(() => hasRequiredDocs(docs), [docs]);

  const statusLine = useMemo(() => {
    if (!appRow) return null;
    if (!appRow.submitted_at) return "📝 Upload required documents, then click Apply/Submit.";
    if (appRow.status === "approved") return "✅ Your application has been approved.";
    if (appRow.status === "rejected") return "❌ Your application was rejected. See note below.";
    return "⏳ Your application is pending review.";
  }, [appRow]);

  async function load() {
    setLoading(true);
    setMsg(null);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) {
      window.location.href = "/members/login";
      return;
    }

    // get or create application row
    const { data: existing, error: selErr } = await supabase
      .from("support_applications")
      .select("id,status,admin_note,created_at,updated_at,submitted_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (selErr) {
      setLoading(false);
      setMsg(selErr.message);
      return;
    }

    let app = existing as AppRow | null;

    if (!app) {
      const { data: created, error: insErr } = await supabase
        .from("support_applications")
        .insert({ user_id: user.id, email: user.email, status: "pending" })
        .select("id,status,admin_note,created_at,updated_at,submitted_at")
        .single();

      if (insErr) {
        setLoading(false);
        setMsg(insErr.message);
        return;
      }
      app = created as AppRow;
    }

    setAppRow(app);

    const { data: docRows, error: docErr } = await supabase
      .from("application_documents")
      .select("id,doc_type,file_path,original_name,created_at")
      .eq("application_id", app.id)
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

  async function uploadDoc(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!appRow) return setMsg("Application not ready yet. Refresh.");
    if (!file) return setMsg("Choose a file to upload.");

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return (window.location.href = "/members/login");

    const safeName = file.name.replace(/[^\w.\-() ]/g, "_");
    const path = `users/${user.id}/applications/${appRow.id}/${Date.now()}-${safeName}`;

    setUploading(true);

    const { error: upErr } = await supabase.storage
      .from("member-docs")
      .upload(path, file, { upsert: false, contentType: file.type || undefined });

    if (upErr) {
      setUploading(false);
      return setMsg(upErr.message);
    }

    const { error: insErr } = await supabase.from("application_documents").insert({
      application_id: appRow.id,
      user_id: user.id,
      doc_type: docType,
      file_path: path,
      original_name: file.name,
    });

    setUploading(false);

    if (insErr) return setMsg(insErr.message);

    setFile(null);
    setMsg("✅ Uploaded successfully.");
    load();
  }

  async function viewDoc(path: string) {
    setMsg(null);
    const { data, error } = await supabase.storage.from("member-docs").createSignedUrl(path, 120);
    if (error) return setMsg(error.message);
    window.open(data.signedUrl, "_blank");
  }

  async function submitApplication() {
    setMsg(null);
    if (!appRow) return;
    if (!readyToSubmit) return setMsg("Upload all required documents first.");

    setSubmitting(true);
    const { error } = await supabase
      .from("support_applications")
      .update({ submitted_at: new Date().toISOString(), status: "pending" })
      .eq("id", appRow.id);

    setSubmitting(false);

    if (error) return setMsg(error.message);

    setMsg("✅ Application submitted successfully. You can track status above.");
    load();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Member Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Download forms, upload documents, and track your application status.
            </p>
          </div>
          <Link href="/" className="text-sm text-neutral-600 hover:underline">
            ← Back to website
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border p-6 text-sm text-neutral-600">Loading…</div>
        ) : (
          <>
            <section className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border p-6 shadow-sm md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Application Status</h2>
                  {appRow ? <Badge status={appRow.status} /> : null}
                </div>

                <p className="mt-3 text-sm text-neutral-700">{statusLine}</p>

                {appRow?.admin_note ? (
                  <div className="mt-4 rounded-2xl border bg-neutral-50 p-4 text-sm text-neutral-800">
                    <div className="font-semibold">Admin Note</div>
                    <div className="mt-1">{appRow.admin_note}</div>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-500">
                  <span>Submitted: {appRow?.submitted_at ? new Date(appRow.submitted_at).toLocaleString() : "Not yet"}</span>
                  <span>Last update: {appRow ? new Date(appRow.updated_at).toLocaleString() : "-"}</span>
                </div>
              </div>

              <div className="rounded-3xl border p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Application Form</h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Download/print, fill, scan, then upload under “Registration Form”.
                </p>

                <div className="mt-4 grid gap-2">
                  <a
                    href={pdfUrl}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Download Form (PDF)
                  </a>

                  <a
                    href={printableHtmlUrl}
                    target="_blank"
                    className="inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-neutral-50"
                  >
                    Print / Save as PDF (Online)
                  </a>
                </div>

                <p className="mt-3 text-xs text-neutral-500">
                  Tip: You can scan with a phone using CamScanner / Google Drive scan.
                </p>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Upload Documents</h2>

              <form onSubmit={uploadDoc} className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium">Document type</label>
                  <select
                    className="mt-2 w-full rounded-xl border px-3 py-3 text-sm"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                  >
                    {DOC_TYPES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Choose file (PDF/JPG/PNG)</label>
                  <input
                    type="file"
                    className="mt-2 w-full rounded-xl border px-3 py-3 text-sm"
                    accept=".pdf,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="md:col-span-3">
                  <button
                    disabled={uploading}
                    className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
                  >
                    {uploading ? "Uploading…" : "Upload document"}
                  </button>

                  <button
                    type="button"
                    disabled={!readyToSubmit || submitting}
                    onClick={submitApplication}
                    className={`mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white ${
                      readyToSubmit ? "bg-emerald-700 hover:bg-emerald-800" : "bg-neutral-300 cursor-not-allowed"
                    } disabled:opacity-60`}
                  >
                    {submitting ? "Submitting…" : readyToSubmit ? "Apply / Submit Application" : "Upload required documents to apply"}
                  </button>

                  <p className="mt-2 text-xs text-neutral-500">
                    Required: Registration Form • Registration Documents • NIN/ID • Passport Photo
                  </p>
                </div>
              </form>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-neutral-800">Your uploaded documents</h3>

                {docs.length === 0 ? (
                  <p className="mt-2 text-sm text-neutral-600">No documents uploaded yet.</p>
                ) : (
                  <div className="mt-3 divide-y rounded-2xl border">
                    {docs.map((d) => (
                      <div key={d.id} className="flex items-center justify-between gap-3 p-4">
                        <div>
                          <div className="text-sm font-medium">{d.doc_type}</div>
                          <div className="text-xs text-neutral-500">
                            {d.original_name ?? d.file_path} • {new Date(d.created_at).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => viewDoc(d.file_path)}
                          className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg ? (
                <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-800 border">{msg}</p>
              ) : null}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

