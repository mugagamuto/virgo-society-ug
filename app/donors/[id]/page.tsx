"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export default function DonorProjectPage() {
  const params = useParams();
  const raw = (params as any)?.id;
  const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);

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
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Project not found.");
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
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/fund-a-project" className="text-sm font-medium hover:underline">← Back to projects</Link>
      </div>

      {loading ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5 text-sm text-mutedInk">Loading…</div>
      ) : err ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{err}</div>
      ) : (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
          <h1 className="text-2xl font-semibold tracking-tight">{project.title ?? "Project"}</h1>
          <p className="mt-2 text-sm text-mutedInk">{project.description ?? ""}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 p-4">
              <div className="text-xs text-mutedInk">Goal</div>
              <div className="mt-1 text-sm font-medium">UGX {Number(project.goal_ugx ?? 0).toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <div className="text-xs text-mutedInk">Raised</div>
              <div className="mt-1 text-sm font-medium">UGX {Number(project.funded_ugx ?? 0).toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <div className="text-xs text-mutedInk">Status</div>
              <div className="mt-1 text-sm font-medium">{project.status ?? "—"}</div>
            </div>
          </div>

          {/* Later: add payment flow / pledge form here */}
        </div>
      )}
    </div>
  );
}