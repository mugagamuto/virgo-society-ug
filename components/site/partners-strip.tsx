import Image from "next/image";
import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";

const partners = [
  { name: "Impact Aid", logo: "/partners/partner-1.svg" },
  { name: "Youth Forward", logo: "/partners/partner-2.svg" },
  { name: "Women Rise", logo: "/partners/partner-3.svg" },
  { name: "EduCare", logo: "/partners/partner-4.svg" },
  { name: "Community Fund", logo: "/partners/partner-5.svg" },
];

export function PartnersStrip() {
  return (
    <section className="bg-white border-y border-black/5 vbs-animate-fade-up vbs-delay-100">
      <Container className="py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge>Partners</Badge>
            <div className="mt-3 text-lg md:text-xl font-semibold tracking-tight">
              Trusted by donors and community partners
            </div>
            <p className="mt-1 text-sm text-mutedInk max-w-2xl">
              Demo logos for now — you can replace them with real logos anytime.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {partners.map((p) => (
            <div
              key={p.name}
              className="vbs-hover-lift rounded-2xl border border-black/10 bg-white p-3 flex items-center justify-center"
              title={p.name}
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={240}
                height={80}
                className="h-10 w-auto opacity-80 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}