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

function ImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-[32px] border border-black/10 bg-black/[0.02] shadow-sm " +
        (className ?? "")
      }
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-emerald-50" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-2xl" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-black/5 blur-2xl" />
      <div className="relative flex h-full w-full items-end justify-between p-6">
        <div>
          <div className="text-xs font-semibold tracking-widest text-black/50 uppercase">Virgo Building Society</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{label}</div>
          <div className="mt-1 text-sm text-black/60">Replace this with a real branded photo later.</div>
        </div>
        <div className="hidden rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-semibold text-black/70 backdrop-blur md:block">
          Premium placeholder
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top gradient wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-emerald-50 via-white to-white" />

      {/* NAV (keep logins here) */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-emerald-200 via-white to-emerald-50">
              <span className="text-sm font-bold text-black/70">V</span>
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
              documents, approves and publishes projects to donors — so every shilling supports real impact.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/donors"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Fund a Project
              </Link>

              <a
                href="https://wa.me/256780787228"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
              >
                WhatsApp Support
              </a>
            </div>

            <div className="mt-2 text-xs text-black/60">
              Logins remain in the top menu. This page stays public and premium.
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Stat label="Approval workflow" value="Member → Admin → Donor" />
              <Stat label="Funding visibility" value="Live totals & progress" />
            </div>
          </div>

          <div className="space-y-4">
            <ImagePlaceholder label="Community impact, verified." className="h-[360px] md:h-[460px]" />
            <div className="grid grid-cols-3 gap-3">
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <div className="h-24 w-full bg-gradient-to-br from-emerald-100 via-white to-emerald-50 md:h-28" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <div className="h-24 w-full bg-gradient-to-br from-white via-emerald-50 to-black/[0.02] md:h-28" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <div className="h-24 w-full bg-gradient-to-br from-emerald-50 via-white to-emerald-100 md:h-28" />
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
                approved projects to donors.
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
                Title, description, goals, stage, location, proposal + budget breakdown.
              </p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">2) Admin verifies</div>
              <p className="mt-2 text-sm text-black/70">
                Review supporting documents (admin-only). Approve or reject with an admin note.
              </p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">3) Donors fund</div>
              <p className="mt-2 text-sm text-black/70">
                Approved projects appear publicly with proposal + budget breakdown + live progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-t border-black/10 bg-black/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-black/50 uppercase">Featured</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Verified projects ready for support</h2>
              <p className="mt-2 max-w-2xl text-sm text-black/70">
                These are visual examples. Live data shows here once projects are approved and published.
              </p>
            </div>
            <Link href="/donors" className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90">
              Fund a Project
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: "Clean Water Access", meta: "Wakiso • Approved" },
              { title: "School Supplies Drive", meta: "Kampala • Approved" },
              { title: "Community Health Outreach", meta: "Mukono • Approved" },
            ].map((p) => (
              <div key={p.title} className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <div className="h-44 bg-gradient-to-br from-emerald-100 via-white to-emerald-50" />
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
            <b>Note:</b> Supporting documents remain visible to Admin only. Donors see proposal + budget breakdown + progress.
          </div>
        </div>
      </section>

      {/* FOOTER (no login buttons here) */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold">Virgo Building Society</div>
              <div className="mt-1 text-xs text-black/60">Transparency-first community funding.</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/donors"
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
              >
                Fund a Project
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

          <div className="mt-6 text-xs text-black/50">© {new Date().getFullYear()} Virgo Building Society.</div>
        </div>
      </footer>
    </div>
  );
}