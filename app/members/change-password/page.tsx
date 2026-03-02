"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function ChangePasswordPage() {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!pw1 || pw1.length < 8) {
      setMsg("Password must be at least 8 characters.");
      return;
    }
    if (pw1 !== pw2) {
      setMsg("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    if (error) setMsg(error.message);
    else {
      setMsg("Password updated ✅");
      setPw1("");
      setPw2("");
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black/10">
        <div className="mx-auto max-w-xl px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Member Portal</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Change password</h1>
              <p className="mt-1 text-sm text-mutedInk">Use a strong password you don’t reuse elsewhere.</p>
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

      <div className="mx-auto max-w-xl px-4 py-8">
        <form onSubmit={submit} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <div>
              <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">New password</div>
              <input
                type="password"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/20"
              />
            </div>

            <div>
              <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Confirm password</div>
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/20"
              />
            </div>

            <button
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {saving ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}