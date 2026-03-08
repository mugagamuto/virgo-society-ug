"use client";

import React from "react";
import Link from "next/link";
import { ImpactGallery } from "@/components/site/impact-gallery";

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

function MiniCard({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
      <img src={img} alt={title} className="h-24 w-full object-cover sm:h-28" />
      <div className="p-3">
        <div className="text-sm font-semibold leading-snug">{title}</div>
        <div className="mt-1 text-xs text-black/60 leading-snug">{desc}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-emerald-50 via-white to-white" />

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
              Fund women &amp; youth ideas that change lives — transparently.
            </h1>

            <p className="mt-4 max-w-xl text-base text-black/70">
              Virgo Building Society supports women and youth groups with ideas but limited capital.
              Groups submit projects with clear goals and budgets, admin verifies, then donors fund with confidence.
            </p>

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

              <Link
                href="/members/join"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-base font-semibold hover:bg-black/[0.02] sm:w-auto"
              >
                Become a Member
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Stat label="Approval workflow" value="Group ? Admin ? Donor" />
              <Stat label="Funding visibility" value="Live totals & progress" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-black/[0.02] shadow-sm">
              <img
                src="/brand/hero.jpg"
                alt="Virgo Building Society impact"
                className="h-[260px] w-full object-cover sm:h-[340px] md:h-[460px]"
                loading="eager"
              />
            </div>

            {/* Cards with description */}
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniCard
                img="/brand/card-1.jpg"
                title="Women Groups"
                desc="Training, mentorship and access to responsible finance."
              />
              <MiniCard
                img="/brand/card-2.jpg"
                title="Youth Startups"
                desc="Skills-building and low-interest support for income growth."
              />
              <MiniCard
                img="/brand/card-3.jpg"
                title="Children Support"
                desc="Targeted welfare and community programs where needed."
              />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT GALLERY (with descriptions) */}
      <ImpactGallery />

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
