export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
        <div className="text-2xl font-semibold tracking-tight">Admin Login</div>
        <p className="mt-1 text-sm text-mutedInk">
          Sign in to manage pages and website settings.
        </p>

        <form onSubmit={signIn} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              type="password"
              required
            />
          </div>

          {msg && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {msg}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Signing inâ€¦" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-xs text-mutedInk">
          If you can login but get redirected back, your user is not added to <code>admin_users</code>.
        </p>
      </div>
    </div>
  );
}