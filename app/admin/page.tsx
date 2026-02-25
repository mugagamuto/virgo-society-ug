export const dynamic = "force-dynamic";
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminGuard } from "@/components/admin/admin-guard";

type PageRow = {
  slug: string;
  title: string;
  updated_at: string;
};

const defaultPages: PageRow[] = [
  { slug: "home", title: "Home", updated_at: new Date().toISOString() },
  { slug: "about", title: "About", updated_at: new Date().toISOString() },
  { slug: "programs", title: "Programs", updated_at: new Date().toISOString() },
  { slug: "loans", title: "Loans", updated_at: new Date().toISOString() },
  { slug: "impact", title: "Impact", updated_at: new Date().toISOString() },
  { slug: "donate", title: "Donate", updated_at: new Date().toISOString() },
  { slug: "contact", title: "Contact", updated_at: new Date().toISOString() },
  { slug: "apply", title: "Apply", updated_at: new Date().toISOString() },
];

export default function AdminHome() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function ensureDefaults() {
    // create missing rows
    for (const p of defaultPages) {
      const { data } = await supabase.from("pages").select("slug").eq("slug", p.slug).maybeSingle();
      if (!data) {
        await supabase.from("pages").insert({
          slug: p.slug,
          title: p.title,
          sections: [],
        });
      }
    }
  }

  async function load() {
    setLoading(true);
    await ensureDefaults();
    const { data } = await supabase
      .from("pages")
      .select("slug,title,updated_at")
      .order("slug", { ascending: true });

    setPages((data as any) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Admin Dashboard</div>
            <div className="mt-1 text-sm text-mutedInk">
              Edit pages and site settings.
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/admin/settings"
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
            >
              Settings
            </Link>
            <button
              onClick={signOut}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold">Pages</div>

          {loading ? (
            <div className="mt-4 text-sm text-mutedInk">Loadingâ€¦</div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/admin/pages/${p.slug}`}
                  className="rounded-2xl border border-black/10 bg-white p-4 hover:bg-black/[0.02]"
                >
                  <div className="font-semibold">{p.title}</div>
                  <div className="mt-1 text-xs text-mutedInk">Slug: {p.slug}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}