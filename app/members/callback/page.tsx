"use client";

import { useEffect } from "react";

export default function MembersCallbackPage() {
  useEffect(() => {
    // Magic-link callback no longer needed (email+password is used).
    // Redirect to login (or dashboard if you prefer).
    window.location.replace("/members/login");
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Redirecting…</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Taking you to the member login page.
        </p>
      </div>
    </main>
  );
}
