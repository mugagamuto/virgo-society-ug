"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type MemberStatus = "active" | "suspended";

type MemberRow = {
  user_id: string;
  org_name: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  district: string | null;
  status: MemberStatus | string;
  created_at: string;
};

type ProjectRow = {
  id: string;
  title: string;
  status: string;
  is_fundable: boolean;
  funded_ugx: number | null;
  created_at: string;
};

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

function isSupabaseLockError(err: any) {
  const m = String(err?.message ?? err ?? "");
  return (
    m.includes("Navigator LockManager") ||
    m.includes("Acquiring an exclusive") ||
    m.includes("auth-token") ||
    m.includes("timed out waiting")
  );
}

export default function AdminMemberDetail({ params }: { params: { id: string } }) {
  const id = params?.id;
  const badId = !id || !isUuid(id);

  const [row, setRow] = useState<MemberRow | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  // If we detect the Supabase auth lock issue, show a recovery card
  const [needsAuthRepair, setNeedsAuthRepair] = useState(false);

  const fundedTotal = useMemo(() => {
    return projects.reduce((acc, p) => acc + Number(p.funded_ugx ?? 0), 0);
  }, [projects]);

  async function load() {
    if (badId) return;
    setLoading(true);
    setMsg(null);
    setResetLink(null);
    setNeedsAuthRepair(false);

    try {
      const { data, error } = await supabase
        .from("members")
        .select("user_id,org_name,contact_name,phone,email,location,district,status,created_at")
        .eq("user_id", id)
        .single();

      if (error) {
        setLoading(false);
        setMsg(error.message);
        return;
      }

      setRow(data as MemberRow);

      const { data: proj, error: projErr } = await supabase
        .from("projects")
        .select("id,title,status,is_fundable,funded_ugx,created_at")
        .eq("org_name", (data as any).org_name)
        .order("created_at", { ascending: false });

      if (!projErr) setProjects((proj ?? []) as ProjectRow[]);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (isSupabaseLockError(err)) {
        setNeedsAuthRepair(true);
        setMsg("Session storage got stuck in this browser. Tap “Fix session” then retry.");
      } else {
        setMsg(err?.message ?? "Something went wrong.");
      }
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badId, id]);

  async function toggleStatus() {
    if (!row) return;
    setSaving(true);
    setMsg(null);
    setNeedsAuthRepair(false);

    const next: MemberStatus = row.status === "active" ? "suspended" : "active";

    try {
      const { error } = await supabase
        .from("members")
        .update({ status: next })
        .eq("user_id", row.user_id);

      setSaving(false);
      if (error) return setMsg(error.message);

      setRow({ ...row, status: next });
      setMsg("✅ Member status updated.");
    } catch (err: any) {
      setSaving(false);
      if (isSupabaseLockError(err)) {
        setNeedsAuthRepair(true);
        setMsg("Session storage got stuck in this browser. Tap “Fix session” then retry.");
      } else {
        setMsg(err?.message ?? "Failed to update status.");
      }
    }
  }

  async function generateResetLink() {
    if (!row?.email) return setMsg("Member has no email saved.");
    setResetLoading(true);
    setMsg(null);
    setResetLink(null);
    setNeedsAuthRepair(false);

    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;

      if (!token) {
        setResetLoading(false);
        return setMsg("Admin session missing. Please sign in again.");
      }

      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: row.email }),
      });

      const json = await res.json();
      setResetLoading(false);

      if (!res.ok) return setMsg(json?.error ?? "Failed to generate reset link");

      setResetLink(json.action_link);
      setMsg("✅ Reset link generated. Copy and send to the member.");
    } catch (err: any) {
      setResetLoading(false);
      if (isSupabaseLockError(err)) {
        setNeedsAuthRepair(true);
        setMsg("Session storage got stuck in this browser. Tap “Fix session” then retry.");
      } else {
        setMsg(err?.message ?? "Failed to generate reset link.");
      }
    }
  }

  if (badId) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="text-lg font-semibold">Invalid member link</div>
        <div className="mt-2 text-sm text-mutedInk">The member id is missing or incorrect.</div>
        <div className="mt-4">
          <Link
            href="/admin/members"
            className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Back to members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Member</h1>
          <p className="mt-1 text-sm text-mutedInk">Manage status and password reset link.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/members"
            className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            ← Back
          </Link>
          <button
            onClick={load}
            className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Refresh
          </button>
        </div>
      </div>

      {needsAuthRepair ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-5 text-sm">
          <div className="font-semibold">Session issue detected</div>
          <div className="mt-1 text-amber-900/80">
            This browser’s saved session got stuck (common on mobile). Use the fix button below, then come back and
            press Refresh.
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/auth-repair"
              className="rounded-2xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
            >
              Fix session
            </Link>
            <button
              onClick={load}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white px-5 py-6 text-sm text-mutedInk">
          Loading…
        </div>
      ) : null}

      {msg ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white px-5 py-4 text-sm">{msg}</div>
      ) : null}

      {row ? (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-black/10 bg-white p-5 lg:col-span-2">
              <div className="text-sm font-semibold">Profile</div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Field label="Organisation" value={row.org_name} />
                <Field label="Contact name" value={row.contact_name} />
                <Field label="Email" value={row.email} />
                <Field label="Phone" value={row.phone} />
                <Field label="Location" value={row.location} />
                <Field label="District" value={row.district} />
                <Field label="Status" value={row.status} />
                <Field label="Created" value={new Date(row.created_at).toLocaleString()} />
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5">
              <div className="text-sm font-semibold">Actions</div>

              <button
                onClick={toggleStatus}
                disabled={saving}
                className="mt-4 w-full rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60"
              >
                {saving ? "Saving…" : row.status === "active" ? "Suspend member" : "Activate member"}
              </button>

              <button
                onClick={generateResetLink}
                disabled={resetLoading}
                className="mt-3 w-full rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {resetLoading ? "Generating…" : "Generate password reset link"}
              </button>

              {resetLink ? (
                <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-medium text-mutedInk">Reset link</div>
                  <div className="mt-2 break-all text-xs">{resetLink}</div>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(resetLink);
                      setMsg("✅ Copied reset link.");
                    }}
                    className="mt-3 w-full rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold hover:bg-black/[0.03]"
                  >
                    Copy link
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-black/10 bg-white">
            <div className="border-b border-black/5 px-5 py-4 text-sm font-medium">
              Projects linked to this member • Funded total: UGX {Number(fundedTotal).toLocaleString("en-UG")}
            </div>

            {projects.length === 0 ? (
              <div className="px-5 py-6 text-sm text-mutedInk">No projects found (yet).</div>
            ) : (
              <div className="divide-y divide-black/5">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <div className="text-sm font-semibold">{p.title}</div>
                      <div className="mt-1 text-xs text-mutedInk">
                        Status: {p.status} • Fundable: {p.is_fundable ? "Yes" : "No"} • Funded: UGX{" "}
                        {Number(p.funded_ugx ?? 0).toLocaleString("en-UG")}
                      </div>
                    </div>
                    <Link
                      href={`/admin/applications/${p.id}`}
                      className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
                    >
                      Open →
                    </Link>
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

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-xs font-medium text-mutedInk">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value || "—"}</div>
    </div>
  );
}
