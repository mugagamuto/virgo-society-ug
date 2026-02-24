import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    tag: "Training",
    title: "Financial Literacy & Savings",
    desc: "Budgeting, savings culture, record-keeping, debt management, pricing, and business discipline.",
  },
  {
    tag: "Enterprise",
    title: "Startup & Group Business Support",
    desc: "Mentorship, market readiness, customer service, operations basics, and growth planning.",
  },
  {
    tag: "Loans",
    title: "Low-Interest Member Loans",
    desc: "Affordable capital for members—designed to avoid predatory lending while encouraging accountability.",
  },
  {
    tag: "Children",
    title: "Child Support & Welfare",
    desc: "Targeted support for education and essentials—linked to household resilience and better outcomes.",
  },
  {
    tag: "Community",
    title: "Group Strengthening & Governance",
    desc: "Leadership, accountability, meeting structures, and simple reporting for strong group performance.",
  },
  {
    tag: "Donors",
    title: "Partner & Donor Programs",
    desc: "Transparent reporting and project sponsorship options aligned to your impact goals.",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Practical support that creates measurable results."
        subtitle="From training and mentorship to affordable loans and child support, Virgo programs are built to be clear, trackable, and community-led."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {programs.map((p) => (
            <Card key={p.title}>
              <CardContent className="p-7">
                <Badge>{p.tag}</Badge>
                <CardTitle className="mt-3">{p.title}</CardTitle>
                <CardDescription className="mt-2">{p.desc}</CardDescription>

                <div className="mt-5">
                  <Link href="/contact" className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-800">
                    Enquire <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}


