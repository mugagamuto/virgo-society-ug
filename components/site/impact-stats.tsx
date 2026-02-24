import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Groups supported", value: "50+" },
  { label: "Members trained", value: "1,000+" },
  { label: "Loan follow-ups", value: "Ongoing" },
  { label: "District coverage", value: "Kampala and beyond" },
];

export function ImpactStats() {
  return (
    <section className="bg-white">
      <Container className="py-10 md:py-14">
        <Badge>Impact</Badge>
        <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
          Built for measurable results
        </h2>
        <p className="mt-2 text-sm md:text-base text-mutedInk max-w-2xl">
          Replace these stats with your real numbers anytime. Clear metrics build trust with members and donors.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border vbs-hover-lift border-black/10 bg-black/[0.02] p-6">
              <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-2 text-xs text-mutedInk">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}