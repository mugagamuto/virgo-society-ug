export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AdminGuard } from "@/components/admin/admin-guard";

type Row = { key: string; value: string };

const defaults: Row[] = [
  { key: "whatsapp", value: "256755077903" },
  { key: "momo_number", value: "MTN MoMo: 07XXXXXXXX" },
  { key: "bank_details", value: "Bank: (Add bank details here)" },
  { key: "email", value: "info@virgosociety.org" },
  { key: "address", value: "Kampala, Uganda" },
  { key: "facebook", value: "" },
  { key: "instagram", value: "" },
  { key: "x", value: "" }
];

export default function AdminSettings() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function ensureDefaults() {
    for (const d of defaults) {
      const { data } = await supabase.from("site_settings").select("key").eq("key", d.key).maybeSingle();
      if (!data) await supabase.from("site_settings").insert({ key: d.key, value: d.value });
    }
  }

  async function load() {
    setStatus(null);
    await ensureDefaults();
    const { data, error } = await supabase.from("site_settings").select("*").order("key");
    if (error) setStatus(error.message);
    setRows((data as any) ?? []);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setStatus(null);
    for (const r of rows) {
      await supabase.from("site_settings").upsert({ key: r.key, value: r.value, updated_at: new Date().toISOString() });
    }
    setStatus("Saved âœ…");
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Site Settings</div>
            <div className="mt-1 text-sm text-mutedInk">WhatsApp, donations, contacts, socials</div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]">
              Back
            </Link>
            <button onClick={save} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              Save
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid gap-4">
            {rows.map((r, idx) => (
              <div key={r.key} className="grid gap-2">
                <label className="text-sm font-semibold">{r.key}</label>
                <input
                  value={r.value ?? ""}
                  onChange={(e) => {
                    const next = [...rows];
                    next[idx] = { ...next[idx], value: e.target.value };
                    setRows(next);
                  }}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            ))}
          </div>
        </div>

        {status && (
          <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
            {status}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}