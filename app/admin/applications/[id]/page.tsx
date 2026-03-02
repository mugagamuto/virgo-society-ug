"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type SupportApp = {
  id: string;
  status: string | null;
  created_at: string;
  project_id: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

type Project = {
  id: string;
  title: string | null;
  status: string | null;
  is_fundable: boolean | null;
  funded_ugx: number | null;
  created_at: string;
};

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function getIdFromPath() {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

export default function AdminApplicationDetail(props: any) {
  // Prefer params.id, but fall back to reading from the URL path
  const routeId = props?.params?.id ?? null;
  const pathId = getIdFromPath();
  const id = (routeId || pathId || "") as string;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [appRow, setAppRow] = useState<SupportApp | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const appStatus = useMemo(() => (appRow?.status ?? "pending"), [appRow]);

  async function load() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      if (!id || id === "undefined" || !isUuid(id)) {
        setAppRow(null);
        setProject(null);
        setErr(`Invalid application ID: ${String(id)}`);
        return;
      }

      // Load application
      const { data: app, error: appErr } = await (supabase as any)
        .from("support_applications")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (appErr) throw appErr;
      if (!app) {
        setAppRow(null);
        setProject(null);
        setErr("Application not found (or blocked by RLS policies).");
        return;
      }

      setAppRow(app as SupportApp);

      // Load related project if project_id exists and is a uuid
      const pid = (app as any).project_id as string | null;
      if (!pid || !isUuid(pid)) {
        setProject(null);
        return;
      }

      const { data: proj, error: projErr } = await (supabase as any)
        .from("projects")
        .select("id,title,status,is_fundable,funded_ugx,created_at")
        .eq("id", pid)
        .maybeSingle();

      if (projErr) {
        setProject(null);
        setMsg("Project could not be loaded (likely RLS). You can still approve/reject the application.");
        return;
      }

      setProject((proj ?? null) as Project | null);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(next: "approved" | "rejected" | "pending") {
    if (!appRow) return;
    setSaving(true);
    setMsg(null);
    try {
      const { error } = await (supabase as any)
        .from("support_applications")
        .update({ status: next })
        .eq("id", appRow.id);

      if (error) throw error;
      setAppRow({ ...appRow, status: next });
      setMsg(`Application marked ${next}.`);
    } catch (e: any) {
      setMsg(e?.message ?? "Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  async function markFundable() {
    if (!project) return setMsg("No project loaded.");
    setSaving(true);
    setMsg(null);
    try {
      const { error } = await (supabase as any)
        .from("projects")
        .update({ is_fundable: true })
        .eq("id", project.id);

      if (error) throw error;
      setProject({ ...project, is_fundable: true });
      setMsg("Project marked fundable.");
    } catch (e: any) {
      setMsg(e?.message ?? "Failed to mark fundable (likely RLS).");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project Review</h1>
          <p className="mt-1 text-sm text-mutedInk">Approve/reject and optionally list on Fund a Project.</p>
          <div className="mt-2 text-xs text-mutedInk">ID: {id || "—"}</div>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/applications" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            ← Back
          </Link>
          <button onClick={load} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5 text-sm text-mutedInk">Loading…</div>
      ) : err ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{err}</div>
      ) : (
        <div className="mt-6 space-y-4">
          {msg ? <div className="rounded-3xl border border-black/10 bg-white p-4 text-sm">{msg}</div> : null}

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Application</div>
                <div className="mt-1 text-xs text-mutedInk">
                  Status: <span className="font-medium">{appStatus}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button disabled={saving} onClick={() => setStatus("approved")} className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
                  Approve
                </button>
                <button disabled={saving} onClick={() => setStatus("rejected")} className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                  Reject
                </button>
                <button disabled={saving} onClick={() => setStatus("pending")} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60">
                  Set pending
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Name</div>
                <div className="mt-1 text-sm font-medium">{appRow?.full_name ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Email</div>
                <div className="mt-1 text-sm font-medium">{appRow?.email ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Phone</div>
                <div className="mt-1 text-sm font-medium">{appRow?.phone ?? "—"}</div>
              </div>
            </div>

            {appRow?.notes ? (
              <div className="mt-4 rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Notes</div>
                <div className="mt-1 text-sm whitespace-pre-wrap">{appRow.notes}</div>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Related project</div>
                <div className="mt-1 text-xs text-mutedInk">project_id: {appRow?.project_id ?? "—"}</div>
              </div>

              <button disabled={saving || !project} onClick={markFundable} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60">
                Mark fundable
              </button>
            </div>

            {!appRow?.project_id ? (
              <div className="mt-3 text-sm text-mutedInk">This application has no project_id saved.</div>
            ) : !project ? (
              <div className="mt-3 text-sm text-mutedInk">Project not loaded (not found or RLS blocked).</div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs text-mutedInk">Title</div>
                  <div className="mt-1 text-sm font-medium">{project.title ?? "—"}</div>
                </div>
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs text-mutedInk">Status</div>
                  <div className="mt-1 text-sm font-medium">{project.status ?? "—"}</div>
                </div>
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs text-mutedInk">Fundable</div>
                  <div className="mt-1 text-sm font-medium">{project.is_fundable ? "Yes" : "No"}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}