"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

function isAllowedAdmin(email?: string | null) {
  // Optional allowlist: set NEXT_PUBLIC_ADMIN_EMAILS="a@x.com,b@y.com"
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const list = raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (list.length === 0) return true; // if not set, allow any authenticated user
  return !!email && list.includes(email.toLowerCase());
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [denied, setDenied] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setChecking(true);
      setDenied(null);

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data.session;
        if (!session?.user) {
          if (!alive) return;
          router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
          return;
        }

        const email = session.user.email ?? null;
        if (!isAllowedAdmin(email)) {
          if (!alive) return;
          setDenied("You are signed in, but your account is not allowed to access admin.");
          return;
        }

        // OK
      } catch (e: any) {
        if (!alive) return;
        setDenied(e?.message ?? "Failed to verify admin session.");
      } finally {
        if (!alive) return;
        setChecking(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [router, pathname]);

  if (checking) {
    return <div className="p-6 text-sm text-mutedInk">Checking admin session…</div>;
  }

  if (denied) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{denied}</div>
      </div>
    );
  }

  return <>{children}</>;
}