"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      window.location.href = "/";
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl border p-8">Signing you out…</div>
      </div>
    </main>
  );
}
