"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/members/login?tab=signup");
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Redirecting...</h1>
        <p className="mt-3 text-sm text-black/60">
          Taking you to the member signup page.
        </p>
      </div>
    </div>
  );
}
