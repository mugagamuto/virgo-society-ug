import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const impactAreas = [
  { title: "Income growth", desc: "Members improve budgeting, stock management and pricing—leading to more stable profits." },
  { title: "Resilient households", desc: "Savings culture reduces shocks and supports children’s education and wellbeing." },
  { title: "Stronger groups", desc: "Governance and accountability tools keep group activities structured and transparent." },
  { title: "Community spillover", desc: "Skills and jobs created by group enterprises benefit the wider neighborhood." },
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="Trackable change, community by community."
        subtitle="Virgo measures outcomes across training completion, enterprise growth, loan performance and child support. Replace the sample content below with your real data anytime."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {impactAreas.map((i) => (
            <Card key={i.title}>
              <CardContent className="p-7">
                <Badge>Outcome</Badge>
                <CardTitle className="mt-3">{i.title}</CardTitle>
                <CardDescription className="mt-2">{i.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-7 shadow-soft">
          <h2 className="text-xl font-semibold tracking-tight">Sample impact dashboard</h2>
          <p className="mt-2 text-sm text-mutedInk">
            Add your real numbers here (groups, members trained, loans disbursed, repayment rate, children supported).
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Metric label="Groups supported" value="120+" />
            <Metric label="Members trained" value="3,500+" />
            <Metric label="Loans disbursed" value="UGX 220M+" />
            <Metric label="Repayment rate" value="92%" />
          </div>
        </div>
      </Container>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-mutedInk mt-1">{label}</div>
    </div>
  );
}


