"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

export default function MemberLoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    // after clicking the magic link, send them to dashboard
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/members/dashboard`;
  }, []);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setMsg("Enter a valid email address.");
      return;
    }

    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { emailRedirectTo: redirectTo },
    });
    setSending(false);

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
          <h1 className="text-2xl font-semibold tracking-tight">Member Login</h1>
          <p className="mt-2 text-sm text-neutral-600">
            We’ll email you a secure sign-in link (no password needed).
          </p>

          <form onSubmit={sendLink} className="mt-6 space-y-4">
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
              disabled={sending}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send sign-in link"}
            </button>

            {msg ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{msg}</p>
            ) : null}

            {sent ? (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Check your email. Open the link to sign in and continue to your dashboard.
              </p>
            ) : null}
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
            <Link href="/" className="hover:underline">← Back to website</Link>
            <Link href="/apply" className="hover:underline">Apply for support</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
