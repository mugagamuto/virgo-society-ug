"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function fmtUgx(n?: number | null) {
  if (n === null || n === undefined) return "UGX 0";
  return `UGX ${Number(n).toLocaleString()}`;
}

export default function DonorProjectPage() {
  const params = useParams();
  const raw = (params as any)?.id;
  const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);

  const budget = useMemo(() => {
    const bb = project?.budget_breakdown;
    if (!bb) return [];
    try {
      return Array.isArray(bb) ? bb : JSON.parse(bb);
    } catch {
      return [];
    }
  }, [project]);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setErr(null);

      try {
        if (!id || !isUuid(id)) {
          setProject(null);
          setErr(`Invalid project id: ${id || "—"}`);
          return;
        }

        const { data, error } = await (supabase as any)
          .from("projects")
          .select("id,title,description,goals,stage,org_name,district,goal_ugx,funded_ugx,budget_ugx,proposal_text,budget_breakdown,proposal_public_url,is_fundable")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Project not found.");
        if (!data.is_fundable) throw new Error("This project is not published for funding yet.");
        setProject(data);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load project.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [id]);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-start justify-between gap-3">
        <Link href="/donors" className="text-sm font-medium hover:underline">← Back to projects</Link>
        {project?.id ? (
          <Link
            href={`/donors/${encodeURIComponent(project.id)}/checkout`}
            className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Fund this project →
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-mutedInk">Loading…</div>
      ) : err ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{err}</div>
      ) : (
        <>
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <h1 className="text-2xl font-semibold tracking-tight">{project.title ?? "Project"}</h1>
            <div className="mt-1 text-xs text-mutedInk">{project.org_name ?? "—"} • {project.district ?? "—"} • Stage: {project.stage ?? "—"}</div>

            {project.description ? <p className="mt-3 text-sm text-mutedInk">{project.description}</p> : null}
            {project.goals ? <p className="mt-2 text-sm text-mutedInk"><span className="font-medium">Goals:</span> {project.goals}</p> : null}

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Goal</div>
                <div className="mt-1 text-sm font-semibold">{fmtUgx(project.goal_ugx)}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Raised</div>
                <div className="mt-1 text-sm font-semibold">{fmtUgx(project.funded_ugx)}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Budget</div>
                <div className="mt-1 text-sm font-semibold">{fmtUgx(project.budget_ugx)}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Project proposal</div>
                <div className="mt-1 text-xs text-mutedInk">Public summary (internal verification docs are not shown)</div>
              </div>
              {project.proposal_public_url ? (
                <a
                  href={project.proposal_public_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]"
                >
                  View proposal PDF
                </a>
              ) : null}
            </div>

            {project.proposal_text ? (
              <div className="mt-3 text-sm text-mutedInk whitespace-pre-wrap">{project.proposal_text}</div>
            ) : (
              <div className="mt-3 text-sm text-mutedInk">Proposal not provided yet.</div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Budget breakdown</div>
            {budget.length ? (
              <div className="mt-3 space-y-2">
                {budget.map((b: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between rounded-2xl border border-black/10 p-3">
                    <div className="text-sm font-medium">{b.item ?? "Item"}</div>
                    <div className="text-sm font-semibold">{fmtUgx(b.amount_ugx ?? 0)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-sm text-mutedInk">No budget breakdown provided yet.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}