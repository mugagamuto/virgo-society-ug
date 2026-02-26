"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

type Status = "draft" | "submitted" | "pending" | "approved" | "rejected";

type Row = {
  id: string;
  title: string | null;
  org_name: string | null;
  location: string | null;
  district: string | null;
  status: Status;
  is_fundable: boolean;
  admin_note: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function AdminApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = (params?.id as string) ?? "";

  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("pending");
  const [fundable, setFundable] = useState(false);
  const [note, setNote] = useState("");

  async function load() {
    if (!id) {
      setErr("Missing application id.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("projects")
      .select("id,title,org_name,location,district,status,is_fundable,admin_note,submitted_at,created_at,updated_at")
      .eq("id", id)
      .single();

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    const r = data as Row;
    setRow(r);
    setStatus(r.status);
    setFundable(!!r.is_fundable);
    setNote(r.admin_note ?? "");
    setLoading(false);
  }

  async function save(next?: Partial<{ status: Status; is_fundable: boolean }>) {
    if (!id) return;
    setSaving(true);
    setErr(null);

    const payload = {
      status: (next?.status ?? status),
      is_fundable: (next?.is_fundable ?? fundable),
      admin_note: note,
      updated_at: new Date().toISOString(),
    };

    const { error } = await (supabase as any)
      .from("projects")
      .update(payload as any)
      .eq("id", id);

    setSaving(false);

    if (error) {
      setErr(error.message);
      return;
    }

    await load();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canShow = useMemo(() => !!row, [row]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project Review</h1>
          <p className="mt-1 text-sm text-mutedInk">Approve/reject and optionally list on Fund a Project.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/applications"
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

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        {loading ? (
          <div className="text-sm text-mutedInk">Loading…</div>
        ) : err ? (
          <div className="text-sm text-red-700">{err}</div>
        ) : !canShow ? (
          <div className="text-sm text-mutedInk">Not found.</div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-black/10 p-4">
              <div className="text-sm font-semibold">{row?.title ?? "Untitled project"}</div>
              <div className="mt-1 text-xs text-mutedInk">
                {row?.org_name ?? "—"} • {row?.location ?? "—"} {row?.district ? `• ${row?.district}` : ""}
              </div>
              <div className="mt-2 text-xs text-mutedInk">
                Submitted: {row?.submitted_at ? new Date(row.submitted_at).toLocaleString() : "Not submitted"}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-mutedInk">Status</div>
                <select
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  <option value="submitted">Submitted</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={fundable}
                    onChange={(e) => setFundable(e.target.checked)}
                  />
                  List on “Fund a Project”
                </label>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-mutedInk">Admin note</div>
              <textarea
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write feedback for the applicant…"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                disabled={saving}
                onClick={() => save()}
                className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>

              <button
                disabled={saving}
                onClick={() => save({ status: "approved" })}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 disabled:opacity-60"
              >
                Approve
              </button>

              <button
                disabled={saving}
                onClick={() => save({ status: "rejected" })}
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 disabled:opacity-60"
              >
                Reject
              </button>

              <button
                disabled={saving}
                onClick={() => save({ status: "pending" })}
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 disabled:opacity-60"
              >
                Mark pending
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}