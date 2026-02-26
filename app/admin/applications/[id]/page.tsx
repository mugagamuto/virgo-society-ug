"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

type Row = {
  id: string;
  title: string;
  org_name: string | null;
  location: string | null;
  district: string | null;
  status: "draft" | "submitted" | "pending" | "approved" | "rejected";
  is_fundable: boolean;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const id = useMemo(() => {
    const v = (params as any)?.id;
    return typeof v === "string" && v.length > 10 ? v : null;
  }, [params]);

  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [status, setStatus] = useState<Row["status"]>("pending");
  const [fundable, setFundable] = useState(false);
  const [note, setNote] = useState("");

  async function load() {
    setMsg(null);

    if (!id) {
      setLoading(false);
      setRow(null);
      setMsg("Missing project id in the URL. Go back and open the project again.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("id,title,org_name,location,district,status,is_fundable,admin_note,created_at,updated_at")
      .eq("id", id)
      .single();

    setLoading(false);

    if (error) return setMsg(error.message);

    const r = data as Row;
    setRow(r);
    setStatus(r.status);
    setFundable(!!r.is_fundable);
    setNote(r.admin_note ?? "");
  }

  async function save() {
    if (!id || !row) return;

    setSaving(true);
    setMsg(null);

    const payload = { status, is_fundable: fundable, admin_note: note };

    // cast supabase to any to avoid TS "never" typing issues in production builds
    const { error } = await (supabase as any)
      .from("projects")
      .update(payload)
      .eq("id", id);

    setSaving(false);

    if (error) return setMsg(error.message);

    setMsg("Saved ✅");
    await load();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project Review</h1>
          <p className="mt-1 text-sm text-mutedInk">Approve/reject and optionally list on Fund a Project.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/applications" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            ← Back
          </Link>
          <button onClick={load} className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
            Refresh
          </button>
        </div>
      </div>

      {msg ? <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">{msg}</div> : null}

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        {loading ? (
          <div className="text-sm text-mutedInk">Loading…</div>
        ) : !row ? (
          <div className="text-sm text-mutedInk">No project found.</div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="text-lg font-semibold">{row.title}</div>
              <div className="mt-1 text-sm text-mutedInk">
                {row.org_name ?? "—"} • {row.location ?? "—"} {row.district ? `• ${row.district}` : ""}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs font-medium text-mutedInk">Status</div>
                <select
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="submitted">Submitted</option>
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
                  Mark as fundable
                </label>
              </div>

              <div className="md:col-span-1" />
            </div>

            <div>
              <div className="text-xs font-medium text-mutedInk">Admin note</div>
              <textarea
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add review comments, reasons, next steps…"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <Link
                href="/admin/applications"
                className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
              >
                Done
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
