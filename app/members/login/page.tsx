"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

type Tab = "login" | "signup";

export default function MemberAuthPage() {
  const [tab, setTab] = useState<Tab>("login");

  // shared
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup (org/group)
  const [orgName, setOrgName] = useState("");
  const [location, setLocation] = useState("");
  const [membersCount, setMembersCount] = useState<string>("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    // useful if you later switch back to email confirmation flows
    return `${window.location.origin}/members/login`;
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const email = loginEmail.trim().toLowerCase();
    if (!email.includes("@")) return setMsg("Enter a valid email address.");
    if (!loginPassword || loginPassword.length < 6) return setMsg("Enter your password (min 6 chars).");

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: loginPassword,
    });
    setLoading(false);

    if (error) return setMsg(error.message);

    window.location.href = "/members/dashboard";
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const email = signupEmail.trim().toLowerCase();
    const mCount = Number(membersCount);

    if (!orgName.trim()) return setMsg("Enter your group/organization name.");
    if (!location.trim()) return setMsg("Enter your location.");
    if (!Number.isFinite(mCount) || mCount <= 0) return setMsg("Enter number of members (e.g. 25).");
    if (!contactName.trim()) return setMsg("Enter the contact person name.");
    if (!phone.trim()) return setMsg("Enter a phone number.");
    if (!email.includes("@")) return setMsg("Enter a valid email address.");
    if (!signupPassword || signupPassword.length < 6) return setMsg("Password must be at least 6 characters.");

    setLoading(true);

    // 1) Create auth account
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: signupPassword,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          org_name: orgName.trim(),
          contact_name: contactName.trim(),
          phone: phone.trim(),
          location: location.trim(),
          members_count: mCount,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      return setMsg(signUpError.message);
    }

    // 2) Save application details (works even if you later require admin approval)
    // NOTE: you must create the table + RLS policy below.
    const userId = data.user?.id ?? null;

    const { error: insertError } = await supabase.from("org_applications").insert({
      user_id: userId,
      org_name: orgName.trim(),
      location: location.trim(),
      members_count: mCount,
      contact_name: contactName.trim(),
      phone: phone.trim(),
      email,
      status: "pending",
    });

    setLoading(false);

    if (insertError) return setMsg(insertError.message);

    setMsg("Application received ✅ Check your email if confirmation is enabled. You can now log in.");
    setTab("login");
    setLoginEmail(email);
    setLoginPassword("");
    setSignupPassword("");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Member Portal</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Log in if you already have an account, or submit your organization signup.
          </p>

          {/* Tabs */}
          <div className="mt-6 grid grid-cols-2 rounded-2xl bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => (setMsg(null), setTab("login"))}
              className={`rounded-2xl px-3 py-2 text-sm font-medium ${
                tab === "login" ? "bg-white shadow-sm" : "text-neutral-600"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => (setMsg(null), setTab("signup"))}
              className={`rounded-2xl px-3 py-2 text-sm font-medium ${
                tab === "signup" ? "bg-white shadow-sm" : "text-neutral-600"
              }`}
            >
              Organization Signup
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={onLogin} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex items-center justify-between text-sm text-neutral-600">
                <Link href="/members/forgot-password" className="hover:underline">
                  Forgot password?
                </Link>
                <button
                  type="button"
                  onClick={() => (setMsg(null), setTab("signup"))}
                  className="hover:underline"
                >
                  New group? Sign up →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onSignup} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Group / Organization Name</label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Virgo Savings Group"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Kampala"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">No. of Members</label>
                  <input
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 25"
                    value={membersCount}
                    onChange={(e) => setMembersCount(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Contact Person</label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. +256 7xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email (used for login)</label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="name@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Create Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Minimum 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit signup"}
              </button>

              <p className="text-xs text-neutral-500">
                After submitting, your application can be reviewed. If email confirmation is enabled in Supabase,
                you may need to confirm your email before logging in.
              </p>
            </form>
          )}

          {msg ? (
            <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-800 border">
              {msg}
            </p>
          ) : null}

          <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
            <Link href="/" className="hover:underline">
              ← Back to website
            </Link>
            <Link href="/apply" className="hover:underline">
              Apply for support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}