import Link from "next/link";
import { Container } from "@/components/site/container";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const programs = [
  {
    title: "Financial skills training",
    desc: "Budgeting, savings discipline, and basic bookkeeping for real business stability.",
    href: "/programs",
  },
  {
    title: "Mentorship and follow-up",
    desc: "Guidance on goals, pricing, customer care, and practical growth steps.",
    href: "/programs",
  },
  {
    title: "Low interest member loans",
    desc: "Small affordable loans for members with clear terms and repayment support.",
    href: "/loans",
  },
  {
    title: "Donor and partner programs",
    desc: "Support youth and women groups at scale through transparent impact reporting.",
    href: "/donate",
  },
];

export function ProgramsGrid() {
  return (
    <section className="bg-white">
      <Container className="py-10 md:py-14">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>Programs</Badge>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
              Practical support that improves income
            </h2>
            <p className="mt-2 text-sm md:text-base text-mutedInk max-w-2xl">
              We focus on what moves the needle: skills, discipline, mentorship, and affordable capital.
            </p>
          </div>
          <Link href="/apply" className="mt-3 md:mt-0">
            <Button variant="secondary">Apply now</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {programs.map((p) => (
            <Card key={p.title} className="border-black/10">
              <CardContent className="p-6">
                <CardTitle>{p.title}</CardTitle>
                <CardDescription className="mt-2">{p.desc}</CardDescription>
                <div className="mt-5">
                  <Link href={p.href}>
                    <Button variant="secondary">Learn more</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}