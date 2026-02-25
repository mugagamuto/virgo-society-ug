"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

type Profile = {
  full_name: string | null;
  phone: string | null;
  district: string | null;
};

export default function MemberDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        window.location.href = "/members/login";
        return;
      }

      const { data: prof } = await supabase
        .from("member_profiles")
        .select("full_name, phone, district")
        .eq("user_id", user.id)
        .single();

      if (!mounted) return;
      setEmail(user.email ?? null);
      setProfile((prof as Profile) ?? null);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-3xl border p-8">Loading your dashboard…</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Member Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Signed in as <span className="font-medium">{email}</span>
            </p>
          </div>

          <Link
            href="/members/logout"
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Logout
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-5">
            <div className="text-sm font-medium">Profile</div>
            <div className="mt-2 text-sm text-neutral-700">
              <div><span className="text-neutral-500">Name:</span> {profile?.full_name ?? "—"}</div>
              <div><span className="text-neutral-500">Phone:</span> {profile?.phone ?? "—"}</div>
              <div><span className="text-neutral-500">District:</span> {profile?.district ?? "—"}</div>
            </div>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="text-sm font-medium">Project / Support status</div>
            <p className="mt-2 text-sm text-neutral-600">
              Next step: we’ll show your applications + statuses (submitted/approved/etc).
            </p>
            <Link href="/apply" className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">
              Apply for support →
            </Link>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="text-sm font-medium">Documents</div>
            <p className="mt-2 text-sm text-neutral-600">
              Next step: upload scanned forms + receipts for approval.
            </p>
            <span className="mt-3 inline-block text-xs rounded-full bg-neutral-100 px-3 py-1">
              Upload UI next
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
