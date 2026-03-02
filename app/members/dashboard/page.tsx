"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string | null;
  org_name: string | null;
  district: string | null;
  status: string | null;
  is_fundable: boolean | null;
  created_at: string;
  goal_ugx?: number | null;
  funded_ugx?: number | null;
  budget_ugx?: number | null;
};

type ApiOk = { ok: true; data: Project[] };
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

function fmtUgx(n?: number | null) {
  if (n === null || n === undefined) return "—";
  return `UGX ${Number(n).toLocaleString()}`;
}

export default function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  // Create modal/form
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [orgName, setOrgName] = useState("");
  const [district, setDistrict] = useState("");
  const [budgetUgx, setBudgetUgx] = useState("");
  const [goalUgx, setGoalUgx] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [stage, setStage] = useState("proposal");

  const canCreate = useMemo(() => {
    return title.trim().length >= 3 && orgName.trim().length >= 2 && district.trim().length >= 2;
  }, [title, orgName, district]);

  async function load() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const { data: sess, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      const token = sess?.session?.access_token;
      if (!token) throw new Error("You are not logged in. Please log in again.");

      const res = await fetch("/api/members/projects", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const { json, text } = await safeJson(res);
      if (!json) throw new Error(`API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);

      const payload = json as ApiResp;
      if (!res.ok || !payload.ok) {
        const m = (payload as any)?.error?.message ?? (payload as any)?.error ?? `HTTP ${res.status}`;
        throw new Error(m);
      }

      setProjects(payload.data ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function createProject() {
    setMsg(null);
    setErr(null);

    if (!canCreate) {
      setMsg("Please fill Title, Organization name, and District.");
      return;
    }

    setCreating(true);
    try {
      const { data: sess, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      const userId = sess?.session?.user?.id;
      if (!userId) throw new Error("Not logged in.");

      const b = budgetUgx.trim() ? Number(budgetUgx.replace(/,/g, "")) : null;
      const g = goalUgx.trim() ? Number(goalUgx.replace(/,/g, "")) : null;

      const payload: any = {
        owner_id: userId,
        title: title.trim(),
        org_name: orgName.trim(),
        district: district.trim(),
        location: "Uganda",
        description: description.trim() || null,
        goals: goals.trim() || null,
        stage: stage,
        budget_ugx: Number.isFinite(b as any) ? b : null,
        goal_ugx: Number.isFinite(g as any) ? g : null,
        status: "draft",
        is_fundable: false,
        funded_ugx: 0,
        amount_raised_ugx: 0,
        submitted_at: null,
      };

      // Use browser supabase (RLS must allow owner insert)
      const { data, error } = await (supabase as any).from("projects").insert(payload).select("id,title,org_name,district,status,is_fundable,created_at,goal_ugx,funded_ugx,budget_ugx").single();

      if (error) throw error;

      setShowCreate(false);
      setTitle(""); setOrgName(""); setDistrict(""); setBudgetUgx(""); setGoalUgx("");
      setDescription(""); setGoals(""); setStage("proposal");

      setMsg("Project created. Now open it to upload documents and submit for review.");
      setProjects((prev) => [data as Project, ...prev]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create project.");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Member Projects</h1>
          <p className="mt-1 text-sm text-mutedInk">Create projects, upload documents, and submit each for admin review.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            + Create Project
          </button>
          <Link href="/" className="text-sm font-medium hover:underline">← Back</Link>
        </div>
      </div>

      {msg ? <div className="mt-4 rounded-2xl border border-black/10 bg-white p-3 text-sm">{msg}</div> : null}
      {err ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div> : null}

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Your projects</div>
          <button onClick={load} className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-mutedInk">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="mt-4 text-sm text-mutedInk">No projects yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{p.title ?? "Untitled project"}</div>
                    <div className="mt-1 text-xs text-mutedInk">
                      {p.org_name ?? "—"} • {p.district ?? "—"} • Status: {p.status ?? "—"} • Fundable: {p.is_fundable ? "Yes" : "No"}
                    </div>
                    <div className="mt-2 text-xs text-mutedInk">
                      Goal: {fmtUgx(p.goal_ugx)} • Budget: {fmtUgx(p.budget_ugx)} • Raised: {fmtUgx(p.funded_ugx)}
                    </div>
                  </div>

                  <Link
                    href={`/members/projects/${encodeURIComponent(p.id)}`}
                    className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">Create a new project</div>
                <div className="mt-1 text-sm text-mutedInk">Save as draft first. After upload documents, submit for review.</div>
              </div>
              <button onClick={() => setShowCreate(false)} className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]">
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Project title *</label>
                <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Organization name *</label>
                <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">District *</label>
                <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Stage</label>
                <select className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={stage} onChange={(e) => setStage(e.target.value)}>
                  <option value="proposal">Proposal</option>
                  <option value="pilot">Pilot</option>
                  <option value="active">Active</option>
                  <option value="scaling">Scaling</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Budget (UGX)</label>
                <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={budgetUgx} onChange={(e) => setBudgetUgx(e.target.value)} placeholder="e.g. 5000000" />
              </div>
              <div>
                <label className="text-sm font-medium">Goal (UGX)</label>
                <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={goalUgx} onChange={(e) => setGoalUgx(e.target.value)} placeholder="e.g. 5000000" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Goals</label>
                <textarea className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" rows={3} value={goals} onChange={(e) => setGoals(e.target.value)} />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:justify-end">
              <button onClick={() => setShowCreate(false)} className="w-full md:w-auto rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-black/[0.03]">
                Cancel
              </button>
              <button
                disabled={!canCreate || creating}
                onClick={createProject}
                className="w-full md:w-auto rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {creating ? "Creating…" : "Create project"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}