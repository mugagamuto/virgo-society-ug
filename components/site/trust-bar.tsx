import { Container } from "@/components/site/container";

const items = [
  { k: "Training", v: "Practical financial skills" },
  { k: "Mentorship", v: "Follow-up and guidance" },
  { k: "Low interest loans", v: "Affordable member loans" },
  { k: "Transparency", v: "Clear reporting for donors" },
];

export function TrustBar() {
  return (
    <section className="border-y border-black/5 bg-white">
      <Container className="py-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.k} className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-sm font-semibold tracking-tight">{it.k}</div>
              <div className="mt-1 text-xs text-mutedInk">{it.v}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}