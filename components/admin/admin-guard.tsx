"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) {
        if (active) router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase.rpc("is_admin", { uid });
      if (error || !data) {
        if (active) router.replace("/admin/login");
        return;
      }

      if (active) setOk(true);
    }

    run();
    return () => {
      active = false;
    };
  }, [router]);

  if (ok !== true) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold">Checking admin access…</div>
          <div className="mt-1 text-sm text-mutedInk">Please wait.</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}