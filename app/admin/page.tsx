"use client";

import Link from "next/link";
import { AdminGuard } from "@/components/admin/admin-guard";

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group rounded-3xl border border-black/10 bg-white p-5 hover:bg-black/[0.02]">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-mutedInk">{desc}</div>
      <div className="mt-3 text-sm font-semibold text-emerald-700 group-hover:underline">Open →</div>
    </Link>
  );
}

export default function AdminHome() {
  return (
    <AdminGuard>
      <div className="max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-mutedInk">Review projects, manage members, and track funding.</p>
          </div>

          <Link href="/" className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]">
            Back to site
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card
            title="Project Applications"
            desc="Review pending applications, verify documents, approve/publish."
            href="/admin/applications"
          />
          <Card
            title="Manage Members"
            desc="View members, activate/suspend accounts."
            href="/admin/members"
          />
          <Card
            title="Funding / Donations"
            desc="Track pledges, amounts per project, and follow up."
            href="/admin/donations"
          />
          <Card
            title="Homepage Gallery"
            desc="Manage gallery cards with crop + resize."
            href="/admin/gallery"
          />
          <Card
            title="Media"
            desc="Upload and manage site media assets."
            href="/admin/media"
          />
          <Card
            title="Settings"
            desc="Admin configuration & tools."
            href="/admin/settings"
          />
        </div>
      </div>
    </AdminGuard>
  );
}