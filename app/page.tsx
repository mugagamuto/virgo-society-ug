"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
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

      {/* NAV (NO admin login here) */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5">
          <nav className="flex items-center gap-2">
            <Link
              href="/donors"
              className="hidden rounded-2xl px-4 py-2 text-base font-semibold text-black/70 hover:bg-black/[0.04] md:inline-flex"
            >
              Fund a Project
            </Link>

            <Link
              href="/members/login"
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-base font-semibold hover:bg-black/[0.02]"
            >
              Member Login
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>Verified community projects</Pill>
              <Pill>Transparent budgets</Pill>
              <Pill>Track every donation</Pill>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              Fund trusted causes that change lives — transparently.
            </h1>

            <p className="mt-4 max-w-xl text-base text-black/70">
              Virgo Building Society helps women and youth groups submit projects with clear goals and budget breakdowns.
              Admin verifies supporting documents, approves and publishes projects to donors — so every shilling supports real impact.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/donors"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-base font-semibold text-white hover:bg-emerald-800"
              >
                Fund a Project
              </Link>

              <a
                href="https://wa.me/256780787228"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-base font-semibold text-emerald-900 hover:bg-emerald-100"
              >
                WhatsApp Support
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Stat label="Approval workflow" value="Group → Admin → Donor" />
              <Stat label="Funding visibility" value="Live totals & progress" />
            </div>
          </div>

          <div className="space-y-4">
            {/* REAL images in /public/brand/ */}
            <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-black/[0.02] shadow-sm">
              <Image
                src="/brand/hero.jpg"
                alt="Virgo Building Society"
                width={1400}
                height={900}
                priority
                className="h-[360px] w-full object-cover md:h-[460px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { src: "/brand/card-1.jpg", alt: "Women and youth innovation" },
                { src: "/brand/card-2.jpg", alt: "Community projects" },
                { src: "/brand/card-3.jpg", alt: "Transparent impact" },
              ].map((item) => (
                <div
                  key={item.src}
                  className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={400}
                    className="h-24 w-full object-cover md:h-28"
                  />
                </div>
              ))}
            </div>

            <div className="text-xs text-black/60">
              If images look empty, confirm these exist: <b>/public/brand/hero.jpg</b> and{" "}
              <b>card-1.jpg</b>…<b>card-3.jpg</b>.
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-black/50 uppercase">How it works</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Clear steps. Strong accountability.</h2>
              <p className="mt-2 max-w-2xl text-sm text-black/70">
                Groups submit project details + proposal & budget breakdown. Admin verifies supporting documents, then publishes
                approved projects to donors.
              </p>
            </div>
            <Link
              href="/donors"
              className="hidden rounded-2xl border border-black/10 bg-white px-4 py-2 text-base font-semibold hover:bg-black/[0.02] md:inline-flex"
            >
              View projects
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold">1) Group submits</div>
              <p className="mt-2 text-sm text-black/70">Title, description, goals, stage, proposal + budget breakdown.</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold">2) Admin verifies</div>
              <p className="mt-2 text-sm text-black/70">Supporting documents are admin-only. Approve/reject with notes.</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold">3) Donors fund</div>
              <p className="mt-2 text-sm text-black/70">Approved projects appear publicly with proposal + budget + progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-semibold">Virgo Building Society</div>
              <div className="mt-1 text-xs text-black/60">Transparency-first community funding.</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/donors"
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-base font-semibold hover:bg-black/[0.02]"
              >
                Fund a Project
              </Link>
              <a
                href="https://wa.me/256780787228"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-black px-4 py-2 text-base font-semibold text-white hover:bg-black/90"
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