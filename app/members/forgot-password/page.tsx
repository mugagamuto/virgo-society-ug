"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setMsg("Enter a valid email address.");
      return;
    }

    const redirectTo =
      typeof window === "undefined"
        ? undefined
        : `${window.location.origin}/members/reset-password`;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(clean, {
      redirectTo,
    });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="mt-2 text-sm text-neutral-600">
            We’ll email you a password reset link.
          </p>

          <form onSubmit={sendReset} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                autoComplete="email"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            {msg ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{msg}</p>
            ) : null}

            {sent ? (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Check your email for the reset link.
              </p>
            ) : null}
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
            <Link href="/members/login" className="hover:underline">← Back to login</Link>
            <Link href="/" className="hover:underline">Back to website</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
