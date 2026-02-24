import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const items = [
  {
    tag: "Children",
    title: "Support children’s education",
    desc: "School support, essential supplies, and targeted welfare that keeps children learning.",
    href: "/donate",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Women",
    title: "Women group training & enterprise",
    desc: "Practical financial skills, savings culture, and support to grow group-led businesses.",
    href: "/programs",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Youth",
    title: "Youth skills & startups",
    desc: "Mentorship, startup readiness, and tools to help youth turn ideas into stable income.",
    href: "/programs",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
];

export function ImpactGallery() {
  return (
    <section className="py-10 md:py-14 border-y border-black/5 bg-white">
      <Container>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>Real impact areas</Badge>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
              Clear focus, visible outcomes
            </h2>
            <p className="mt-2 text-sm md:text-base text-mutedInk max-w-2xl">
              We support children, women groups, and youth-led startups through training, mentorship, and affordable capital.
            </p>
          </div>
          <Link href="/impact" className="mt-3 md:mt-0">
            <Button variant="secondary">View impact</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <Card key={it.title} className="overflow-hidden">
              <div className="relative h-44 sm:h-52">
                <Image
                  src={it.img}
                  alt={it.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              </div>
              <CardContent className="p-6">
                <Badge>{it.tag}</Badge>
                <CardTitle className="mt-3">{it.title}</CardTitle>
                <CardDescription className="mt-2">{it.desc}</CardDescription>
                <div className="mt-5">
                  <Link href={it.href}>
                    <Button className="w-full" variant={it.tag === "Children" ? "primary" : "secondary"}>
                      Learn more
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-4 text-xs text-mutedInk">
          Photos are placeholders for now — we can replace them with your real Uganda photos anytime.
        </p>
      </Container>
    </section>
  );
}
