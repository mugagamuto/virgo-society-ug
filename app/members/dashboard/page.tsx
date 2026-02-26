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

  project_title: string | null;
  project_description: string | null;
  project_goals: string | null;
  project_stage: string | null;
  project_budget_ugx: number | null;
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

function hasProjectDetails(app: AppRow | null) {
  if (!app) return false;
  const budgetOk = typeof app.project_budget_ugx === "number" && app.project_budget_ugx > 0;
  return !!(app.project_title && app.project_description && app.project_goals && app.project_stage && budgetOk);
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

export default function MemberDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [appRow, setAppRow] = useState<AppRow | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);

  const [docType, setDocType] =
    useState<(typeof DOC_TYPES)[number]["value"]>("registration_form");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [savingDetails, setSavingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goals, setGoals] = useState("");
  const [stage, setStage] = useState("");
  const [budget, setBudget] = useState<string>("");

  const printableFormRoute = "/forms/support-application";

  const readyDocs = useMemo(() => hasRequiredDocs(docs), [docs]);
  const readyProject = useMemo(() => hasProjectDetails(appRow), [appRow]);
  const readyToSubmit = readyDocs && readyProject;

  const statusLine = useMemo(() => {
    if (!appRow) return null;
    if (!appRow.submitted_at) return "📝 Complete project details + upload required documents, then submit.";
    if (appRow.status === "approved") return "✅ Approved.";
    if (appRow.status === "rejected") return "❌ Rejected. See admin note.";
    return "⏳ Pending review.";
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

    const { data: existing, error: selErr } = await supabase
      .from("support_applications")
      .select("id,status,admin_note,created_at,updated_at,submitted_at,project_title,project_description,project_goals,project_stage,project_budget_ugx")
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
        .select("id,status,admin_note,created_at,updated_at,submitted_at,project_title,project_description,project_goals,project_stage,project_budget_ugx")
        .single();

      if (insErr) {
        setLoading(false);
        setMsg(insErr.message);
        return;
      }
      app = created as AppRow;
    }

    setAppRow(app);
    setTitle(app.project_title ?? "");
    setDesc(app.project_description ?? "");
    setGoals(app.project_goals ?? "");
    setStage(app.project_stage ?? "");
    setBudget(app.project_budget_ugx ? String(app.project_budget_ugx) : "");

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

  async function saveProjectDetails() {
    setMsg(null);
    if (!appRow) return;

    const b = Number(budget);
    if (!title.trim()) return setMsg("Enter project title.");
    if (!desc.trim()) return setMsg("Enter project description.");
    if (!goals.trim()) return setMsg("Enter goals & objectives.");
    if (!stage.trim()) return setMsg("Enter current stage.");
    if (!Number.isFinite(b) || b <= 0) return setMsg("Enter a valid budget (UGX).");

    setSavingDetails(true);
    const { error } = await supabase
      .from("support_applications")
      .update({
        project_title: title.trim(),
        project_description: desc.trim(),
        project_goals: goals.trim(),
        project_stage: stage.trim(),
        project_budget_ugx: b,
      })
      .eq("id", appRow.id);

    setSavingDetails(false);
    if (error) return setMsg(error.message);

    setMsg("✅ Project details saved.");
    load();
  }

  async function uploadDoc(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!appRow) return setMsg("Application not ready yet.");
    if (!file) return setMsg("Choose a file first.");

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
    setMsg("✅ Uploaded.");
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
    if (!readyToSubmit) return setMsg("Complete project details and upload required docs first.");

    setSubmitting(true);
    const { error } = await supabase
      .from("support_applications")
      .update({ submitted_at: new Date().toISOString(), status: "pending" })
      .eq("id", appRow.id);

    setSubmitting(false);
    if (error) return setMsg(error.message);

    setMsg("✅ Application submitted.");
    load();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Member Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">Fill project details, upload docs, then submit.</p>
          </div>
          <Link href="/" className="text-sm text-neutral-600 hover:underline">← Back</Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border p-6 text-sm text-neutral-600">Loading…</div>
        ) : (
          <>
            <section className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border p-6 shadow-sm md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Status</h2>
                  {appRow ? <Badge status={appRow.status} /> : null}
                </div>
                <p className="mt-3 text-sm text-neutral-700">{statusLine}</p>

                {appRow?.admin_note ? (
                  <div className="mt-4 rounded-2xl border bg-neutral-50 p-4 text-sm text-neutral-800">
                    <div className="font-semibold">Admin Note</div>
                    <div className="mt-1">{appRow.admin_note}</div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Printable Form</h2>
                <p className="mt-2 text-sm text-neutral-600">Open then Print → Save as PDF.</p>
                <a
                  href={printableFormRoute}
                  target="_blank"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Open Form
                </a>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Project Details</h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Project title</label>
                  <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Project description</label>
                  <textarea className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Goals & objectives</label>
                  <textarea className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" rows={4} value={goals} onChange={(e) => setGoals(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-medium">Stage reached</label>
                  <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={stage} onChange={(e) => setStage(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-medium">Total budget (UGX)</label>
                  <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
              </div>

              <button
                onClick={saveProjectDetails}
                disabled={savingDetails}
                className="mt-4 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
              >
                {savingDetails ? "Saving…" : "Save project details"}
              </button>

              <div className="mt-2 text-xs text-neutral-500">
                {readyProject ? "✅ Project details complete" : "⚠️ Please complete all fields"}
              </div>
            </section>

            <section className="mt-6 rounded-3xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Upload Documents</h2>

              <form onSubmit={uploadDoc} className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium">Document type</label>
                  <select className="mt-2 w-full rounded-xl border px-3 py-3 text-sm" value={docType} onChange={(e) => setDocType(e.target.value as any)}>
                    {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Choose file</label>
                  <input type="file" className="mt-2 w-full rounded-xl border px-3 py-3 text-sm" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </div>

                <div className="md:col-span-3">
                  <button disabled={uploading} className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60">
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
                    {submitting ? "Submitting…" : readyToSubmit ? "Apply / Submit Application" : "Complete details + upload required docs to apply"}
                  </button>

                  <p className="mt-2 text-xs text-neutral-500">
                    Required docs: Registration Form • Registration Documents • NIN/ID • Passport Photo
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
                        <button onClick={() => viewDoc(d.file_path)} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg ? <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-800 border">{msg}</p> : null}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
