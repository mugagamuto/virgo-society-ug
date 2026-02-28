"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

type ProjectRow = {
  id: string;
  title: string;
  status: string;
  admin_note: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;

  org_name: string | null;
  members_count: number | null;
  location: string | null;
  district: string | null;

  description: string;
  goals: string;
  stage: string;
  budget_ugx: number;
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
  { value: "budget_breakdown", label: "Budget Breakdown" },
  { value: "other", label: "Other Supporting Document" },
] as const;

const REQUIRED_DOCS = ["registration_form", "registration_documents", "nin", "photo"] as const;

function hasRequiredDocs(docs: { doc_type: string }[]) {
  const s = new Set(docs.map((d) => d.doc_type));
  return REQUIRED_DOCS.every((t) => s.has(t));
}

function Pill({ status }: { status: string }) {
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

export default function MemberDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(() => projects.find((p) => p.id === activeId) ?? null, [projects, activeId]);

  const [docs, setDocs] = useState<DocRow[]>([]);
  const [docType, setDocType] = useState<(typeof DOC_TYPES)[number]["value"]>("registration_form");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // form fields (edit/create)
  const [orgName, setOrgName] = useState("");
  const [membersCount, setMembersCount] = useState<string>("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [stage, setStage] = useState("");
  const [budget, setBudget] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const printableFormRoute = "/forms/support-application";

  function fillForm(p: ProjectRow | null) {
    setOrgName(p?.org_name ?? "");
    setMembersCount(p?.members_count ? String(p.members_count) : "");
    setLocation(p?.location ?? "");
    setDistrict(p?.district ?? "");
    setTitle(p?.title ?? "");
    setDescription(p?.description ?? "");
    setGoals(p?.goals ?? "");
    setStage(p?.stage ?? "");
    setBudget(p?.budget_ugx ? String(p.budget_ugx) : "");
  }

  async function loadProjects() {
    setLoading(true);
    setMsg(null);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      window.location.href = "/members/login";
      return;
    }

    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      setSaving(false);
      setMsg("You must be logged in.");
      return;
    }

    const { data, error } = await (supabase as any).from("projects").insert({
        owner_id: authData.user.id,
        owner_email: authData.user.email,
        title: "New Project",
        description: "Describe your project…",
        goals: "List goals & objectives…",
        stage: "Planning",
        budget_ugx: 1000000,
        status: "draft",
      })
      .select("*")
      .single();

    setSaving(false);

    if (error) return setMsg(error.message);

    const newRow = data as ProjectRow;
    setProjects((p) => [newRow, ...p]);
    setActiveId(newRow.id);
    setMsg("✅ New project created. Edit details below.");
  }

  async function saveProject() {
    setMsg(null);
    if (!active) return;

    const b = Number(budget);
    const mc = membersCount ? Number(membersCount) : null;

    if (!title.trim()) return setMsg("Enter project title.");
    if (!description.trim()) return setMsg("Enter project description.");
    if (!goals.trim()) return setMsg("Enter goals & objectives.");
    if (!stage.trim()) return setMsg("Enter current stage.");
    if (!Number.isFinite(b) || b <= 0) return setMsg("Enter a valid budget (UGX).");

    if (membersCount && (!Number.isFinite(mc) || (mc ?? 0) <= 0)) return setMsg("Members count must be a number.");

    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        org_name: orgName.trim() || null,
        members_count: mc,
        location: location.trim() || null,
        district: district.trim() || null,
        title: title.trim(),
        description: description.trim(),
        goals: goals.trim(),
        stage: stage.trim(),
        budget_ugx: b,
      })
      .eq("id", active.id);

    setSaving(false);
    if (error) return setMsg(error.message);

    setMsg("✅ Saved.");
    loadProjects();
  }

  async function uploadDoc(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!active) return setMsg("Select a project first.");
    if (!file) return setMsg("Choose a file first.");

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return (window.location.href = "/members/login");

    const safeName = file.name.replace(/[^\w.\-() ]/g, "_");
    const path = `users/${authData.user.id}/projects/${active.id}/${Date.now()}-${safeName}`;

    setUploading(true);

    const { error: upErr } = await supabase.storage
      .from("member-docs")
      .upload(path, file, { upsert: false, contentType: file.type || undefined });

    if (upErr) {
      setUploading(false);
      return setMsg(upErr.message);
    }

    const { error: insErr } = await supabase.from("project_documents").insert({
      project_id: active.id,
      owner_id: authData.user.id,
      doc_type: docType,
      file_path: path,
      original_name: file.name,
    });

    setUploading(false);
    if (insErr) return setMsg(insErr.message);

    setFile(null);
    setMsg("✅ Uploaded.");
    loadDocs(active.id);
  }

  async function viewDoc(path: string) {
    setMsg(null);
    const { data, error } = await supabase.storage.from("member-docs").createSignedUrl(path, 120);
    if (error) return setMsg(error.message);
    window.open(data.signedUrl, "_blank");
  }

  const readyDocs = useMemo(() => hasRequiredDocs(docs), [docs]);

  async function submitProject() {
    setMsg(null);
    if (!active) return;

    if (!readyDocs) return setMsg("Upload required documents first (registration form, registration documents, NIN/ID, passport photo).");

    setSubmitting(true);
    const { error } = await supabase
      .from("projects")
      .update({ status: "submitted", submitted_at: new Date().toISOString() })
      .eq("id", active.id);

    setSubmitting(false);
    if (error) return setMsg(error.message);

    setMsg("✅ Project submitted. Admin will review it.");
    loadProjects();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Member Projects</h1>
            <p className="mt-1 text-sm text-neutral-600">Create multiple projects, upload documents, and submit each for review.</p>
          </div>
          <Link href="/" className="text-sm text-neutral-600 hover:underline">← Back</Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border p-6 text-sm text-neutral-600">Loading…</div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Left: project list */}
            <div className="rounded-3xl border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Your Projects</div>
                <button
                  onClick={createNew}
                  disabled={saving}
                  className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                >
                  + New
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {projects.length === 0 ? (
                  <div className="text-sm text-neutral-600">No projects yet.</div>
                ) : (
                  projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveId(p.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left hover:bg-neutral-50 ${
                        p.id === activeId ? "border-emerald-300 bg-emerald-50" : "border-black/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold line-clamp-1">{p.title}</div>
                        <Pill status={p.status} />
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        Updated: {new Date(p.updated_at).toLocaleString()}
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="mt-6 rounded-2xl border bg-neutral-50 p-4">
                <div className="text-xs font-semibold">Printable form</div>
                <a
                  href={printableFormRoute}
                  target="_blank"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-black/90"
                >
                  Open (Print/Save PDF)
                </a>
              </div>
            </div>

            {/* Right: project editor + docs */}
            <div className="lg:col-span-2 space-y-6">
              {!active ? (
                <div className="rounded-3xl border p-6 text-sm text-neutral-600">Select a project to manage.</div>
              ) : (
                <>
                  <div className="rounded-3xl border p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Project Details</div>
                        <div className="text-xs text-neutral-500">These details will appear on Admin and (if approved) Fund a Project.</div>
                      </div>
                      <Pill status={active.status} />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Organisation name</label>
                        <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Members count</label>
                        <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={membersCount} onChange={(e) => setMembersCount(e.target.value)} inputMode="numeric" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">District</label>
                        <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={district} onChange={(e) => setDistrict(e.target.value)} />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium">Project title</label>
                        <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
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
                        <input className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" value={budget} onChange={(e) => setBudget(e.target.value)} inputMode="numeric" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row">
                      <button
                        onClick={saveProject}
                        disabled={saving}
                        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>

                      <button
                        onClick={submitProject}
                        disabled={submitting || !readyDocs}
                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 ${
                          readyDocs ? "bg-black hover:bg-black/90" : "bg-neutral-300"
                        }`}
                      >
                        {submitting ? "Submitting…" : readyDocs ? "Submit Project" : "Upload required docs to submit"}
                      </button>
                    </div>

                    {active.admin_note ? (
                      <div className="mt-4 rounded-2xl border bg-neutral-50 p-4 text-sm text-neutral-800">
                        <div className="font-semibold">Admin note</div>
                        <div className="mt-1">{active.admin_note}</div>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-3xl border p-6 shadow-sm">
                    <div className="text-sm font-semibold">Project Documents</div>
                    <p className="mt-1 text-xs text-neutral-500">
                      Required: Registration Form • Registration Documents • NIN/ID • Passport Photo
                    </p>

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
                        <button disabled={uploading} className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60">
                          {uploading ? "Uploading…" : "Upload document"}
                        </button>
                      </div>
                    </form>

                    <div className="mt-6">
                      <div className="text-sm font-semibold">Uploaded</div>
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
                  </div>

                  {msg ? (
                    <div className="rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-800">{msg}</div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

