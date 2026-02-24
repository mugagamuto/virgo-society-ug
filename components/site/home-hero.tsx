import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HomeHero() {
  return (
    <section className="bg-white vbs-animate-fade-up">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <Badge>Virgo Building Society</Badge>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              Empowering Ugandas youth and women to build sustainable incomes.
            </h1>
            <p className="mt-4 text-base md:text-lg text-mutedInk max-w-2xl">
              We support registered groups and startups through financial skills training, mentorship,
              and affordable low-interest member loans. Donors and partners help us scale this impact.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/apply">
                <Button className="w-full sm:w-auto">Apply for support</Button>
              </Link>
              <Link href="/donate">
                <Button className="w-full sm:w-auto" variant="secondary">Donate</Button>
              </Link>
              <Link href="/programs">
                <Button className="w-full sm:w-auto" variant="secondary">View programs</Button>
              </Link>
            </div>

            <div className="mt-6 text-xs text-mutedInk">
              WhatsApp support available. We respond quickly during working hours.
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-8">
            <div className="text-sm font-semibold tracking-tight">What you get</div>
            <ul className="mt-4 space-y-3 text-sm text-mutedInk">
              <li><span className="font-medium text-ink">Training:</span> budgeting, savings discipline, record keeping.</li>
              <li><span className="font-medium text-ink">Mentorship:</span> business guidance and follow-ups.</li>
              <li><span className="font-medium text-ink">Loans:</span> affordable low-interest member loans with clear terms.</li>
              <li><span className="font-medium text-ink">Children support:</span> targeted welfare where needed.</li>
            </ul>

            <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs text-mutedInk">Priority applicants</div>
              <div className="mt-1 text-sm font-semibold">
                Registered youth and women groups, and early-stage startups.
              </div>
              <div className="mt-2 text-xs text-mutedInk">
                Tip: include your members count, district, and what support will improve income.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}