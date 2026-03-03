import { Container } from "./container";
import { Badge } from "@/components/ui/badge";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="py-12 md:py-16 border-b border-black/5 bg-gradient-to-b from-brand-50/50 to-white">
      <Container>
        <Badge>{eyebrow}</Badge>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm md:text-base text-mutedInk max-w-3xl">{subtitle}</p>
      </Container>
    </section>
  );
}


