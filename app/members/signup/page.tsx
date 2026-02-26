"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

export default function MemberSignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName || cleanName.length < 2) {
      setMsg("Enter your full name.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMsg("Enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: cleanName, role: "member" },
      },
    });

    if (error) {
      setLoading(false);
      setMsg(error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      await supabase
        .from("members")
        .upsert(
          {
            id: userId,
            email: cleanEmail,
            full_name: cleanName,
            created_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
    }

    setLoading(false);
    setDone(true);

    if (data.session) {
      window.location.href = "/members/dashboard";
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Sign up to access your member dashboard.
          </p>

          <form onSubmit={signUp} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Sarah Namugga"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            {msg ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{msg}</p>
            ) : null}

            {done ? (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Account created. If your email confirmation is enabled, check your inbox to confirm, then come back and log in.
              </p>
            ) : null}
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
            <Link href="/members/login" className="hover:underline">
              Already have an account? Login
            </Link>
            <Link href="/" className="hover:underline">
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
