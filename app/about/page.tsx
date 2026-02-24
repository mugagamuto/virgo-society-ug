import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Virgo"
        title="A practical pathway to sustainable incomes."
        subtitle="Virgo Building Society Uganda empowers registered youth and women groups through financial training, mentorship, and access to affordable low-interest loans, while supporting children and strengthening community resilience."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-7">
              <Badge>Mission</Badge>
              <CardTitle className="mt-3">Empower communities</CardTitle>
              <CardDescription className="mt-2">
                Equip youth and women with the financial skills, tools, and access to capital needed to build stable livelihoods.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-7">
              <Badge>Vision</Badge>
              <CardTitle className="mt-3">A thriving Uganda</CardTitle>
              <CardDescription className="mt-2">
                A financially empowered society where grassroots entrepreneurs grow sustainable businesses and families flourish.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-7">
              <Badge>Values</Badge>
              <CardTitle className="mt-3">Dignity & trust</CardTitle>
              <CardDescription className="mt-2">
                Community-led action, transparency, accountability, and measurable outcomes for every program.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft">
            <h2 className="text-xl font-semibold tracking-tight">Who we serve</h2>
            <ul className="mt-4 space-y-2 text-sm text-mutedInk list-disc pl-5">
              <li>Registered youth groups and youth-led startups</li>
              <li>Women savings groups and community enterprises</li>
              <li>Vulnerable households with children needing targeted support</li>
              <li>Local partners focused on inclusive economic development</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft">
            <h2 className="text-xl font-semibold tracking-tight">How we work</h2>
            <ol className="mt-4 space-y-2 text-sm text-mutedInk list-decimal pl-5">
              <li>Group onboarding, verification, and goal setting</li>
              <li>Training and mentorship in financial and enterprise skills</li>
              <li>Access to small low-interest loans with fair terms</li>
              <li>Follow-up support and impact reporting</li>
            </ol>
          </div>
        </div>
      </Container>
    </>
  );
}



