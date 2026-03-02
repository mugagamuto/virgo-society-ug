import Link from "next/link";

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
      {/* Top gradient wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-emerald-50 via-white to-white" />

      {/* NAV */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02]">
              {/* If you have a logo file, place it at /public/brand/logo.png */}
              <img src="/brand/logo.png" alt="Virgo Building Society" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Virgo Building Society</div>
              <div className="text-xs text-black/60">Build hope. Fund impact.</div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/donors"
              className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-black/70 hover:bg-black/[0.04] md:inline-flex"
            >
              Fund a Project
            </Link>
            <Link
              href="/members/login"
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
            >
              Member Login
            </Link>
            <Link
              href="/admin/login"
              className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            >
              Admin
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
              Virgo Building Society helps members submit projects with clear goals and budget breakdowns. Admin verifies
              documentation, approves and publishes projects to donors — so every shilling supports real impact.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/donors"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Fund a Project
              </Link>
              <Link
                href="/members/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/[0.02]"
              >
                Submit a Project (Members)
              </Link>
            </div>

            {/* WhatsApp (NO bouncing animation) */}
            <div className="mt-5">
              <a
                href="https://wa.me/256780787228"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
              >
                WhatsApp Support
              </a>
              <div className="mt-2 text-xs text-black/60">Fast help with submissions, verification, and donations.</div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Stat label="Approval workflow" value="Member → Admin → Donor" />
              <Stat label="Funding visibility" value="Live totals & progress" />
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[32px] border border-black/10 bg-black/[0.02] shadow-sm">
              {/* Put a premium hero image at /public/brand/hero.jpg */}
              <img src="/brand/hero.jpg" alt="Community impact" className="h-[360px] w-full object-cover md:h-[460px]" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <img src="/brand/gallery-1.jpg" alt="Impact 1" className="h-24 w-full object-cover md:h-28" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <img src="/brand/gallery-2.jpg" alt="Impact 2" className="h-24 w-full object-cover md:h-28" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <img src="/brand/gallery-3.jpg" alt="Impact 3" className="h-24 w-full object-cover md:h-28" />
              </div>
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
                Members submit project details + proposal & budget breakdown. Admin verifies supporting documents, then publishes
                approved projects to the Fund a Project page.
              </p>
            </div>
            <Link
              href="/donors"
              className="hidden rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02] md:inline-flex"
            >
              View projects
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">1) Member submits</div>
              <p className="mt-2 text-sm text-black/70">
                Title, description, goals, stage, location, budget + proposal and budget breakdown.
              </p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">2) Admin verifies</div>
              <p className="mt-2 text-sm text-black/70">
                Review supporting documents (IDs, letters, approvals). Approve or reject with an admin note.
              </p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">3) Donors fund</div>
              <p className="mt-2 text-sm text-black/70">
                Approved projects appear publicly with proposal & budget breakdown, and track progress transparently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS (visual placeholder) */}
      <section className="border-t border-black/10 bg-black/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-black/50 uppercase">Featured</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Verified projects ready for support</h2>
              <p className="mt-2 max-w-2xl text-sm text-black/70">
                These are examples of how approved projects will look. Your live data will appear here once projects are published.
              </p>
            </div>
            <Link
              href="/donors"
              className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            >
              Fund a Project
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Clean Water Access",
                meta: "Wakiso • Approved",
                img: "/brand/project-1.jpg",
              },
              {
                title: "School Supplies Drive",
                meta: "Kampala • Approved",
                img: "/brand/project-2.jpg",
              },
              {
                title: "Community Health Outreach",
                meta: "Mukono • Approved",
                img: "/brand/project-3.jpg",
              },
            ].map((p) => (
              <div key={p.title} className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <div className="h-44 bg-black/[0.02]">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="mt-1 text-xs text-black/60">{p.meta}</div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href="/donors"
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      Fund
                    </Link>
                    <Link
                      href="/donors"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 text-sm text-black/70">
            <b>Note:</b> Supporting documents remain visible to Admin only. Donors see project proposal + budget breakdown + progress.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold">Virgo Building Society</div>
              <div className="mt-1 text-xs text-black/60">Transparency-first community funding.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/donors" className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]">
                Fund a Project
              </Link>
              <Link href="/members/login" className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]">
                Member Login
              </Link>
              <a
                href="https://wa.me/256780787228"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-6 text-xs text-black/50">
            © {new Date().getFullYear()} Virgo Building Society. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}