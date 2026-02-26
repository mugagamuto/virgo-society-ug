"use client";

import { useEffect } from "react";

export default function AuthRepairPage() {
  useEffect(() => {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("sb-") || k.includes("supabase") || k.includes("auth-token")) {
          localStorage.removeItem(k);
        }
      });
    } catch {}

    window.location.replace("/donors");
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h1 className="text-lg font-semibold">Fixing your session…</h1>
          <p className="mt-2 text-sm text-neutral-600">
            If this takes long, refresh the page.
          </p>
        </div>
      </div>
    </main>
  );
}
