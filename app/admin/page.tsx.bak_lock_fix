"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";

type Metrics = {
  members: { total: number; active: number; suspended: number };
  applications: { pending: number; approved: number; rejected: number };
  projects: { total: number; fundable: number };
  funding: { pledged_total: number; pledged_paid: number; pledged_pending: number };
};

async function safeJson(res: Response) {
  const t = await res.text();
  try { return { json: JSON.parse(t), text: t }; } catch { return { json: null as any, text: t }; }
}

function fmtUgx(n?: number | null) {
  const v = Number(n ?? 0);
  return `UGX ${Number.isFinite(v) ? v.toLocaleString() : "0"}`;
}

function MetricCard({
  title,
  value,
  hint,
  tone,
}: {
  title: string;
  value: string;
  hint?: string;
  tone?: "emerald" | "amber" | "red" | "ink";
}) {
  const cls =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "amber"
      ? "border-amber-200 bg-amber-50"
      : tone === "red"
      ? "border-red-200 bg-red-50"
      : "border-black/10 bg-white";

  return (
    <div className={`rounded-3xl border p-5 ${cls}`}>
      <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-mutedInk">{hint}</div> : null}
    </div>
  );
}

function NavCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group rounded-3xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-mutedInk">{desc}</div>
        </div>
        <div className="text-sm font-semibold text-emerald-700 group-hover:underline">Open ?</div>
      </div>
    </Link>
  );
}

export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);

    const res = await fetch("/api/admin/metrics", { cache: "no-store" });
    const { json, text } = await safeJson(res);

    if (!json) {
      setErr(`Non-JSON (${res.status}): ${text.slice(0, 200)}`);
      setMetrics(null);
      setLoading(false);
      return;
    }

    if (!res.ok || !json.ok) {
      setErr(json?.error?.message ?? json?.error ?? "Failed to load metrics.");
      setMetrics(null);
      setLoading(false);
      return;
    }

    setMetrics(json.metrics as Metrics);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const headerHint = useMemo(() => {
    if (!metrics) return null;
    const published = metrics.projects.fundable;
    const pending = metrics.applications.pending;
    return `Published ${published} • Pending review ${pending}`;
  }, [metrics]);

  return (
    <AdminGuard>
      <div className="max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Admin</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-mutedInk">
              Review projects, manage members, and track funding.
              {headerHint ? <span className="ml-2 text-xs">• {headerHint}</span> : null}
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={load} className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]">
              Refresh
            </button>
            <Link href="/" className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]">
              Back to site
            </Link>
          </div>
        </div>

        {err ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{err}</div>
        ) : null}

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Members"
            value={loading || !metrics ? "…" : String(metrics.members.total)}
            hint={loading || !metrics ? "Loading" : `${metrics.members.active} active • ${metrics.members.suspended} suspended`}
            tone="ink"
          />
          <MetricCard
            title="Pending review"
            value={loading || !metrics ? "…" : String(metrics.applications.pending)}
            hint="Applications awaiting approval"
            tone="amber"
          />
          <MetricCard
            title="Published"
            value={loading || !metrics ? "…" : String(metrics.projects.fundable)}
            hint="Projects visible on Fund a Project"
            tone="emerald"
          />
          <MetricCard
            title="Pledged total"
            value={loading || !metrics ? "…" : fmtUgx(metrics.funding.pledged_total)}
            hint={loading || !metrics ? "" : `Paid ${fmtUgx(metrics.funding.pledged_paid)} • Pending ${fmtUgx(metrics.funding.pledged_pending)}`}
            tone="ink"
          />
        </div>

        {/* Navigation */}
        <div className="grid gap-4 md:grid-cols-2">
          <NavCard title="Project Applications" desc="Review pending applications, verify documents, approve/publish." href="/admin/applications" />
          <NavCard title="Manage Members" desc="View members, activate/suspend accounts." href="/admin/members" />
          <NavCard title="Funding / Donations" desc="Track pledges and totals per project." href="/admin/donations" />
          <NavCard title="Homepage Gallery" desc="Manage gallery cards with crop + resize." href="/admin/gallery" />
          <NavCard title="Media" desc="Upload and manage site media assets." href="/admin/media" />
          <NavCard title="Settings" desc="Admin configuration & tools." href="/admin/settings" />
        </div>
      </div>
    </AdminGuard>
  );
}
