"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type ProjectRow = {
  id: string;
  title: string | null;
  org_name: string | null;
  district: string | null;
  status: string | null;
  is_fundable: boolean | null;
  goal_ugx: number | null;
  funded_ugx: number | null;
  amount_raised_ugx: number | null;
  created_at: string;
  updated_at: string | null;
};

type MemberRow = {
  user_id: string;
  org_name: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  district: string | null;
  status: string | null;
  created_at: string | null;
};

function fmtUGX(n: number) {
  try {
    return new Intl.NumberFormat("en-UG").format(n);
  } catch {
    return String(n);
  }
}

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs text-mutedInk">{sub}</div> : null}
    </div>
  );
}

export default function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [member, setMember] = useState<MemberRow | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  async function load() {
    setLoading(true);
    setMsg(null);

    const { data: auth } = await supabase.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) {
      setMsg("Please login to view your dashboard.");
      setLoading(false);
      return;
    }

    const { data: m, error: mErr } = await supabase
      .from("members")
      .select("user_id,org_name,contact_name,phone,email,location,district,status,created_at")
      .eq("user_id", uid)
      .maybeSingle();

    if (mErr) setMsg(mErr.message);
    setMember((m as any) ?? null);

    const { data: p, error: pErr } = await supabase
      .from("projects")
      .select("id,title,org_name,district,status,is_fundable,goal_ugx,funded_ugx,amount_raised_ugx,created_at,updated_at")
      .eq("owner_id", uid)
      .order("created_at", { ascending: false });

    if (pErr) setMsg(pErr.message);
    setProjects((p as any) ?? []);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const metrics = useMemo(() => {
    const total = projects.length;
    const pending = projects.filter((p) => (p.status || "").toLowerCase() === "pending").length;
    const approved = projects.filter((p) => (p.status || "").toLowerCase() === "approved").length;
    const fundable = projects.filter((p) => !!p.is_fundable).length;

    const totalGoal = projects.reduce((a, p) => a + Number(p.goal_ugx ?? 0), 0);
    const totalFunded = projects.reduce((a, p) => a + Number(p.funded_ugx ?? p.amount_raised_ugx ?? 0), 0);

    return { total, pending, approved, fundable, totalGoal, totalFunded };
  }, [projects]);

  const fundedProjects = useMemo(() => {
    return projects
      .map((p) => ({
        ...p,
        raised: Number(p.funded_ugx ?? p.amount_raised_ugx ?? 0),
        goal: Number(p.goal_ugx ?? 0),
      }))
      .filter((p) => p.raised > 0 || !!p.is_fundable)
      .sort((a, b) => (b.raised ?? 0) - (a.raised ?? 0));
  }, [projects]);

  const greetingName = member?.contact_name || member?.org_name || "Member";

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Member Portal</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome, {greetingName}</h1>
<div className="mt-4 flex gap-3"><a href="/members/dashboard?new=1" className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Create New Project</a></div>
              <p className="mt-1 text-sm text-mutedInk">
                Track your projects, upload documents, submit for review, and monitor funding progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/members/profile"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
              >
                Profile
              </Link>
              <Link
                href="/members/change-password"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
              >
                Change Password
              </Link>
              <Link
                href="/members/dashboard"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Refresh
              </Link>
            </div>
          </div>

          {msg ? <div className="mt-3 text-sm text-red-700">{msg}</div> : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 text-sm text-mutedInk">Loading…</div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              <Card title="Projects" value={String(metrics.total)} sub={`${metrics.pending} pending • ${metrics.approved} approved`} />
              <Card title="Fundable" value={String(metrics.fundable)} sub="Approved and visible on Fund a Project" />
              <Card title="Total funded" value={`UGX ${fmtUGX(metrics.totalFunded)}`} sub={`Total goal UGX ${fmtUGX(metrics.totalGoal)}`} />
            </div>

            <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Your projects</div>
                  <div className="text-xs text-mutedInk">Open a project to upload documents and submit for admin review.</div>
                </div>
                <Link
                  href="/members/dashboard"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
                >
                  Refresh
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-mutedInk">
                  No projects yet. Use “Create Project” on this page (top action) or ask admin to enable it if hidden.
                </div>
              ) : (
                <div className="mt-4 grid gap-3">
                  {projects.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-black/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{p.title || "Untitled project"}</div>
                          <div className="mt-1 text-xs text-mutedInk">
                            {(p.org_name || "").trim()} {p.district ? `• ${p.district}` : ""} • Status: {p.status || "draft"} • Fundable:{" "}
                            {p.is_fundable ? "Yes" : "No"}
                          </div>
                          <div className="mt-1 text-xs text-mutedInk">
                            Goal: UGX {fmtUGX(Number(p.goal_ugx ?? 0))} • Funded: UGX {fmtUGX(Number(p.funded_ugx ?? p.amount_raised_ugx ?? 0))}
                          </div>
                        </div>

                        <Link
                          href={`/members/projects/${p.id}`}
                          className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
                        >
                          Open ?
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">Funding progress</div>
              <div className="text-xs text-mutedInk">Projects with funding activity or marked as fundable.</div>

              {fundedProjects.length === 0 ? (
                <div className="mt-4 text-sm text-mutedInk">No funding activity yet.</div>
              ) : (
                <div className="mt-4 grid gap-3">
                  {fundedProjects.slice(0, 6).map((p) => {
                    const pct = p.goal > 0 ? Math.min(100, Math.round((p.raised / p.goal) * 100)) : 0;
                    return (
                      <div key={p.id} className="rounded-2xl border border-black/10 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold">{p.title || "Project"}</div>
                          <div className="text-xs text-mutedInk">{pct}%</div>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10">
                          <div className="h-full bg-emerald-700" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-mutedInk">
                          UGX {fmtUGX(p.raised)} raised • Goal UGX {fmtUGX(p.goal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

