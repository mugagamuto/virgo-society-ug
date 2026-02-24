import Link from "next/link";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CtaBand() {
  return (
    <section className="py-12">
      <Container>
        <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-brand-50 via-white to-sun-50 p-8 md:p-10 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge>Open to donors & partners</Badge>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                Help a youth or women group grow into a sustainable business.
              </h2>
              <p className="mt-2 text-sm text-mutedInk max-w-2xl">
                Your support funds training, group tools, and a revolving low-interest loan pool that empowers families and strengthens communities.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/donate"><Button size="lg">Donate</Button></Link>
              <Link href="/contact"><Button size="lg" variant="secondary">Partner with us</Button></Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


