import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const options = [
  {
    tag: "Most popular",
    title: "Sponsor a training session",
    desc: "Support materials, facilitation, and follow-up mentorship for a cohort of members.",
  },
  {
    tag: "Loans",
    title: "Grow the revolving loan fund",
    desc: "Help more members access affordable capital while keeping repayment sustainable.",
  },
  {
    tag: "Children",
    title: "Support education essentials",
    desc: "Back-to-school needs, supplies, and targeted support for vulnerable children.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Support sustainable incomes—one group at a time."
        subtitle="Virgo is open to donors and partners. This page is designed for non-integrated donations: you can receive bank / mobile money details via contact, or plug in a payment provider later."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {options.map((o) => (
            <Card key={o.title}>
              <CardContent className="p-7">
                <Badge>{o.tag}</Badge>
                <CardTitle className="mt-3">{o.title}</CardTitle>
                <CardDescription className="mt-2">{o.desc}</CardDescription>
                <div className="mt-6">
                  <Link href="/contact">
                    <Button className="w-full">Get donation details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-7">
          <h2 className="text-xl font-semibold tracking-tight">Prefer a partnership?</h2>
          <p className="mt-2 text-sm text-mutedInk max-w-3xl">
            Partner with Virgo to sponsor a district, a set of groups, a training program, or the loan fund. We provide clear reporting and stories (with consent) for your updates.
          </p>
          <div className="mt-5">
            <Link href="/contact"><Button size="lg" variant="secondary">Talk to us</Button></Link>
          </div>
        </div>
      </Container>
    </>
  );
}


