import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const items = [
  {
    tag: "Children",
    title: "Support children's education",
    desc: "School support, essential supplies, and targeted welfare that keeps children learning.",
    href: "/donate",
    img: "/photos/children.jpg",
  },
  {
    tag: "Women",
    title: "Women group training and enterprise",
    desc: "Practical financial skills, savings culture, and support to grow group-led businesses.",
    href: "/programs",
    img: "/photos/women.jpg",
  },
  {
    tag: "Youth",
    title: "Youth skills and startups",
    desc: "Mentorship, startup readiness, and tools to help youth turn ideas into stable income.",
    href: "/programs",
    img: "/photos/youth.jpg",
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
                />
              </div>
              <CardContent className="p-6">
                <Badge>{it.tag}</Badge>
                <CardTitle className="mt-3">{it.title}</CardTitle>
                <CardDescription className="mt-2">{it.desc}</CardDescription>
                <div className="mt-5">
                  <Link href={it.href}>
                    <Button className="w-full" variant={it.tag -eq "Children" ? "primary" : "secondary"}>
                      Learn more
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-4 text-xs text-mutedInk">
          Put your three real Uganda photos in public/photos as children.jpg, women.jpg, and youth.jpg.
        </p>
      </Container>
    </section>
  );
}