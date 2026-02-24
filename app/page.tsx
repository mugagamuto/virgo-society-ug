import Link from "next/link";
import Image from "next/image";
import { ArrowRight, HandHeart, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { CtaBand } from "@/components/site/cta-band";
import { site } from "@/content/site";

const highlights = [
  {
    icon: Users,
    title: "Support registered groups",
    desc: "We work with organized youth & women groups and strengthen group governance and accountability.",
  },
  {
    icon: ShieldCheck,
    title: "Financial skills & training",
    desc: "Budgeting, saving, enterprise skills, record-keeping, and mentorship for sustainable incomes.",
  },
  {
    icon: HandHeart,
    title: "Children & community care",
    desc: "Targeted support that helps children stay in school and families stay resilient.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">

        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero.jpg"
            alt="Virgo Building Society Uganda community empowerment"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/80" />
        </div>

        <Container className="py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <FadeIn>
              <Badge>Uganda • Youth • Women • Children</Badge>
              <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                Building sustainable incomes for communities that deserve a real chance.
              </h1>
              <p className="mt-4 text-base md:text-lg text-mutedInk max-w-xl">
                {site.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/donate">
                  <Button size="lg">
                    Donate now <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button size="lg" variant="secondary">
                    Explore programs
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <Stat label="Groups supported" value="120+" />
                <Stat label="Members trained" value="3,500+" />
                <Stat label="Loan repayment" value="92%" />
              </div>
              <p className="mt-2 text-xs text-mutedInk">
                Replace these numbers with your real metrics anytime in <code className="px-1 py-0.5 rounded bg-black/5">app/page.tsx</code>.
              </p>
            </FadeIn>

            <FadeIn delay={0.08} className="relative">
              <div className="rounded-3xl border border-black/10 bg-white shadow-soft overflow-hidden">
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">How Virgo works</div>
                      <div className="text-sm text-mutedInk mt-1">Simple pathway from training → capital → growth.</div>
                    </div>
                    <Badge>Community-led</Badge>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <Step n="1" title="Identify & register groups" desc="We verify groups, leadership, and goals." />
                    <Step n="2" title="Train & mentor members" desc="Financial literacy + business skills." />
                    <Step n="3" title="Provide low-interest loans" desc="Affordable revolving capital for members." />
                    <Step n="4" title="Track outcomes" desc="Impact reporting for donors and partners." />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link href="/about"><Button variant="ghost">Learn more</Button></Link>
                    <Link href="/contact"><Button variant="secondary">Talk to us</Button></Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((h, idx) => (
              <FadeIn key={h.title} delay={idx * 0.06}>
                <Card>
                  <CardContent className="p-7">
                    <div className="h-11 w-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                      <h.icon size={20} />
                    </div>
                    <CardTitle className="mt-4">{h.title}</CardTitle>
                    <CardDescription className="mt-2">{h.desc}</CardDescription>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16 bg-black/[0.02] border-y border-black/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Badge>Programs</Badge>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">What we do</h2>
              <p className="mt-2 text-sm text-mutedInk max-w-2xl">
                Practical, trackable support for entrepreneurs, community groups, and vulnerable children.
              </p>
            </div>
            <Link href="/programs">
              <Button variant="secondary">View all programs</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ProgramCard title="Financial Skills Bootcamps" tag="Training" desc="Budgeting, saving, record-keeping, pricing and basic tax awareness." imageSrc="/images/training.jpg" />
            <ProgramCard title="Youth & Women Enterprise Support" tag="Enterprise" desc="Mentorship, market access, and tools to grow micro-businesses." imageSrc="/images/loans.jpg" />
            <ProgramCard title="Child Support & Welfare" tag="Children" desc="School support and essential needs linked to household resilience." imageSrc="/images/children.jpg" />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-mutedInk mt-1">{label}</div>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="h-9 w-9 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-sm font-semibold">
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-mutedInk mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function ProgramCard({
  title,
  desc,
  tag,
  imageSrc,
}: {
  title: string;
  desc: string;
  tag: string;
  imageSrc: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-7">
        <Badge>{tag}</Badge>
        <div className="mt-3 text-lg font-semibold tracking-tight">{title}</div>
        <p className="mt-2 text-sm text-mutedInk">{desc}</p>
        <div className="mt-5">
          <Link
            href="/programs"
            className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Learn more <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}




