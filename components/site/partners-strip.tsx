import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";

const partners = [
  { name: "Partner / Donor 1" },
  { name: "Partner / Donor 2" },
  { name: "Partner / Donor 3" },
  { name: "Partner / Donor 4" },
  { name: "Partner / Donor 5" },
];

export function PartnersStrip() {
  return (
    <section className="bg-white border-y border-black/5">
      <Container className="py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge>Partners</Badge>
            <div className="mt-3 text-lg md:text-xl font-semibold tracking-tight">
              Trusted by donors and community partners
            </div>
            <p className="mt-1 text-sm text-mutedInk max-w-2xl">
              Replace placeholders with real partner logos anytime.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {partners.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-5 text-center text-xs md:text-sm font-medium text-ink"
            >
              {p.name}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}