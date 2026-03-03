"use client";

import React from "react";
import Link from "next/link";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-xl font-semibold tracking-tight sm:text-2xl">{value}</div>
      <div className="mt-1 text-sm text-black/60">{label}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-black/70 backdrop-blur">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-emerald-50 via-white to-white" />

      {/* NAV */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Optional: add logo here if you want */}
          <div className="text-sm font-semibold text-black/80">Virgo Building Society</div>

          <nav className="flex items-center gap-2">
            <Link
              href="/donors"
              className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-black/70 hover:bg-black/[0.04] sm:inline-flex"
            >
              Fund a Project
            </Link>

            <Link
              href="/members/login"
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
            >
              Member Login
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="grid gap-7 md:grid-cols-2 md:items-center">
          {/* LEFT */}
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>Verified community projects</Pill>
              <Pill>Transparent budgets</Pill>
              <Pill>Track every donation</Pill>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Fund women & youth ideas that change lives — transparently.
            </h1>

            <p className="mt-4 max-w-xl text-base text-black/70">
              Virgo Building Society supports women and youth groups with ideas but limited capital.
              Groups submit projects with clear goals and budgets, admin verifies, then donors fund with confidence.
            </p>

            {/* Buttons: full width on mobile */}
            <div className="mt-6 grid gap-3 sm:flex sm:flex-row">
              <Link
                href="/donors"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-base font-semibold text-white hover:bg-emerald-800 sm:w-auto"
              >
                Fund a Project
              </Link>

              <a
                href="https://wa.me/256780787228"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-base font-semibold text-emerald-900 hover:bg-emerald-100 sm:w-auto"
              >
                WhatsApp Support
              </a>
            </div>

            {/* Stats: 1 column on mobile, 2 on larger */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Stat label="Approval workflow" value="Group ? Admin ? Donor" />
              <Stat label="Funding visibility" value="Live totals & progress" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* Hero image with safe height */}
            <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-black/[0.02] shadow-sm">
              <img
                src="/brand/hero.jpg"
                alt="Virgo Building Society impact"
                className="h-[260px] w-full object-cover sm:h-[340px] md:h-[460px]"
                loading="eager"
              />
            </div>

            {/* Cards: 2 columns on mobile for nicer fit */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <img src="/brand/card-1.jpg" alt="Women and youth innovation" className="h-24 w-full object-cover sm:h-28" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <img src="/brand/card-2.jpg" alt="Community project teams" className="h-24 w-full object-cover sm:h-28" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <img src="/brand/card-3.jpg" alt="Transparent impact" className="h-24 w-full object-cover sm:h-28" />
              </div>
            </div>

            <div className="text-xs text-black/60">
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-widest text-black/50 uppercase">How it works</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Clear steps. Strong accountability.</h2>
              <p className="mt-2 max-w-2xl text-sm text-black/70">
                Groups submit project details, proposal and budget. Admin verifies supporting documents, then publishes approved
                projects for donors to fund.
              </p>
            </div>

            <Link
              href="/donors"
              className="inline-flex w-full justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-base font-semibold hover:bg-black/[0.02] sm:w-auto"
            >
              View projects
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold">1) Group submits</div>
              <p className="mt-2 text-sm text-black/70">Title, description, goals, proposal + budget breakdown.</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold">2) Admin verifies</div>
              <p className="mt-2 text-sm text-black/70">Supporting documents stay private. Approve/reject with notes.</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold">3) Donors fund</div>
              <p className="mt-2 text-sm text-black/70">Approved projects go public with budget + progress updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-semibold">Virgo Building Society</div>
              <div className="mt-1 text-xs text-black/60">Transparency-first community funding.</div>
            </div>

            <div className="grid w-full gap-2 sm:flex sm:w-auto">
              <Link
                href="/donors"
                className="inline-flex w-full justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-base font-semibold hover:bg-black/[0.02] sm:w-auto"
              >
                Fund a Project
              </Link>
              <a
                href="https://wa.me/256780787228"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full justify-center rounded-2xl bg-black px-4 py-2 text-base font-semibold text-white hover:bg-black/90 sm:w-auto"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-6 text-xs text-black/50">© {new Date().getFullYear()} Virgo Building Society.</div>
        </div>
      </footer>
    </div>
  );
}
