"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

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

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/20"
      />
    </div>
  );
}

export default function MemberProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [row, setRow] = useState<MemberRow | null>(null);

  async function load() {
    setLoading(true);
    setMsg(null);

    const { data: auth } = await supabase.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) {
      setMsg("Please login.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("members")
      .select("user_id,org_name,contact_name,phone,email,location,district,status,created_at")
      .eq("user_id", uid)
      .maybeSingle();

    if (error) setMsg(error.message);
    setRow((data as any) ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!row) return;
    setSaving(true);
    setMsg(null);

    const payload = {
      org_name: (row.org_name ?? "").trim() || null,
      contact_name: (row.contact_name ?? "").trim() || null,
      phone: (row.phone ?? "").trim() || null,
      location: (row.location ?? "").trim() || null,
      district: (row.district ?? "").trim() || null,
    };

    const { error } = await supabase.from("members").update(payload).eq("user_id", row.user_id);
    if (error) setMsg(error.message);
    else setMsg("Saved ✅");

    setSaving(false);
    await load();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black/10">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Member Portal</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Profile</h1>
              <p className="mt-1 text-sm text-mutedInk">Keep your organization details accurate for verification.</p>
            </div>
            <Link
              href="/members/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
            >
              Back
            </Link>
          </div>

          {msg ? <div className="mt-3 text-sm text-mutedInk">{msg}</div> : null}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {loading ? (
          <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 text-sm text-mutedInk">Loading…</div>
        ) : !row ? (
          <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 text-sm text-mutedInk">
            No member record found. Contact admin to activate your account.
          </div>
        ) : (
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Organization"
                value={row.org_name ?? ""}
                onChange={(v) => setRow({ ...row, org_name: v })}
                placeholder="Virgo Youth Group"
              />
              <Field
                label="Contact name"
                value={row.contact_name ?? ""}
                onChange={(v) => setRow({ ...row, contact_name: v })}
                placeholder="Jane Doe"
              />
              <Field label="Email" value={row.email ?? ""} onChange={() => {}} placeholder="" />
              <Field
                label="Phone"
                value={row.phone ?? ""}
                onChange={(v) => setRow({ ...row, phone: v })}
                placeholder="+256 7xx xxx xxx"
              />
              <Field
                label="Location"
                value={row.location ?? ""}
                onChange={(v) => setRow({ ...row, location: v })}
                placeholder="Kampala"
              />
              <Field
                label="District"
                value={row.district ?? ""}
                onChange={(v) => setRow({ ...row, district: v })}
                placeholder="Wakiso"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>

              <button
                onClick={load}
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}