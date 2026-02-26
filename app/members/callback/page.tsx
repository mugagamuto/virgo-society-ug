"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export default function MembersCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [msg, setMsg] = useState("Signing you in...");

  useEffect(() => {
    async function run() {
      try {
        const code = sp.get("code");
        const token_hash = sp.get("token_hash");
        const type = sp.get("type");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          router.replace("/members/dashboard");
          return;
        }

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });
          if (error) throw error;
          router.replace("/members/dashboard");
          return;
        }

        setMsg("Invalid sign-in link. Please request a new sign-in email.");
        setTimeout(() => router.replace("/members/login"), 1200);
      } catch (e) {
        setMsg("Sign-in failed. Please try again.");
        setTimeout(() => router.replace("/members/login"), 1200);
      }
    }

    run();
  }, []);

  return (
    <main className="min-h-screen grid place-items-center bg-white px-4">
      <div className="max-w-md w-full rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Please wait…</h1>
        <p className="mt-2 text-sm text-neutral-600">{msg}</p>
      </div>
    </main>
  );
}
