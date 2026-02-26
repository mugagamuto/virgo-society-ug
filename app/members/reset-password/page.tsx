"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!password || password.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    window.location.href = "/members/dashboard";
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Enter a new password for your account.
          </p>

          <form onSubmit={updatePassword} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">New password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm new password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Update password"}
            </button>

            {msg ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{msg}</p>
            ) : null}
          </form>

          <div className="mt-6 text-sm text-neutral-600">
            <Link href="/" className="hover:underline">← Back to website</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
