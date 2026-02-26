import Link from "next/link";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";

const projects = [
  {
    id: "youth-skills-kampala",
    title: "Youth Skills Training — Kampala",
    location: "Kampala",
    goalUGX: 5000000,
    raisedUGX: 1200000,
    summary: "Support vocational & financial skills training for youth groups.",
  },
  {
    id: "women-savings-gulu",
    title: "Women Savings Group Support — Gulu",
    location: "Gulu",
    goalUGX: 3500000,
    raisedUGX: 650000,
    summary: "Help registered women groups access tools, training, and mentorship.",
  },
  {
    id: "community-agri-mbarara",
    title: "Community Agribusiness Starter Kits — Mbarara",
    location: "Mbarara",
    goalUGX: 7000000,
    raisedUGX: 2100000,
    summary: "Fund starter kits and coaching for community agribusiness initiatives.",
  },
];

function fmtUGX(n: number) {
  return n.toLocaleString("en-UG");
}

export default function DonorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Fund a Project"
        title="Fund verified community projects that need support"
        subtitle="Choose a project below and support it directly. For general organization donations, use the Donate page."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p) => {
            const pct = Math.min(100, Math.round((p.raisedUGX / p.goalUGX) * 100));
            return (
              <div key={p.id} className="rounded-3xl border border-black/10 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-mutedInk">{p.location}</div>
                    <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm text-mutedInk">{p.summary}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-mutedInk">
                    <span>Raised: UGX {fmtUGX(p.raisedUGX)}</span>
                    <span>Goal: UGX {fmtUGX(p.goalUGX)}</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-black/10">
                    <div className="h-2 rounded-full bg-emerald-700" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-mutedInk">{pct}% funded</div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/donors/${p.id}`}
                    className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Fund this project
                  </Link>
                  <Link
                    href="/donate"
                    className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.03]"
                  >
                    Donate to organization
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold">Want your project listed?</h2>
          <p className="mt-2 text-sm text-mutedInk">
            Member groups can apply for support from the Member Dashboard. Approved projects can be added here for funding.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/members/login?tab=signup" className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90">
              Member signup
            </Link>
            <Link href="/members/login" className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.03]">
              Member login
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
