import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoansPage() {
  return (
    <>
      <PageHero
        eyebrow="Low-interest loans"
        title="Affordable loans designed for growth, not stress."
        subtitle="Virgo provides small, low-interest loans to eligible members and registered groups, supported by training and clear repayment terms to keep the fund sustainable."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-7">
              <Badge>Eligibility</Badge>
              <CardTitle className="mt-3">Who can apply?</CardTitle>
              <CardDescription className="mt-2">
                Members within registered groups who have completed basic financial training and meet simple accountability checks.
              </CardDescription>
              <ul className="mt-4 space-y-2 text-sm text-mutedInk list-disc pl-5">
                <li>Active member in a registered group</li>
                <li>Verified income activity or business plan</li>
                <li>Attendance in training sessions</li>
                <li>Agreed repayment schedule</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-7">
              <Badge>How it works</Badge>
              <CardTitle className="mt-3">Simple loan process</CardTitle>
              <CardDescription className="mt-2">
                We combine training, fair terms, and follow-up support to keep loans useful and repayment healthy.
              </CardDescription>
              <ol className="mt-4 space-y-2 text-sm text-mutedInk list-decimal pl-5">
                <li>Apply through your group leader or Virgo office</li>
                <li>Short review + basic verification</li>
                <li>Disbursement + mentoring follow-up</li>
                <li>Repayment tracking + support</li>
              </ol>
              <div className="mt-6 flex gap-3">
                <Link href="/contact"><Button>Apply / Ask</Button></Link>
                <Link href="/donate"><Button variant="secondary">Support loan fund</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-7">
          <h2 className="text-xl font-semibold tracking-tight">For donors</h2>
          <p className="mt-2 text-sm text-mutedInk max-w-3xl">
            Donor support can strengthen the revolving loan pool and expand training coverage. We provide simple, transparent reporting on how funds are allocated and repaid.
          </p>
          <div className="mt-5">
            <Link href="/donate"><Button size="lg">Donate to the loan fund</Button></Link>
          </div>
        </div>
      </Container>
    </>
  );
}


