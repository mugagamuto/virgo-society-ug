"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

export default function MemberLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMsg("Enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setMsg("Enter your password (at least 6 characters).");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
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
          <h1 className="text-2xl font-semibold tracking-tight">Member Login</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Sign in with your email and password.
          </p>

          <form onSubmit={signIn} className="mt-6 space-y-4">
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

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {msg ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {msg}
              </p>
            ) : null}
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
            <Link href="/members/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
            <Link href="/apply" className="hover:underline">
              Apply for support
            </Link>
          </div>

          <div className="mt-6 text-sm text-neutral-600">
            <Link href="/" className="hover:underline">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
