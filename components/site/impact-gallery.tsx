import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";

type Item = {
  title: string;
  subtitle: string;
  src: string;
  href: string;
};

const items: Item[] = [
  {
    title: "Children Support",
    subtitle: "Community programs that improve wellbeing and opportunity.",
    src: "/photos/children.jpg",
    href: "/impact",
  },
  {
    title: "Women Groups",
    subtitle: "Training, mentorship, and access to responsible finance.",
    src: "/photos/women.jpg",
    href: "/programs",
  },
  {
    title: "Youth Startups",
    subtitle: "Skills-building and low-interest support for income growth.",
    src: "/photos/youth.jpg",
    href: "/apply",
  },
];

export function ImpactGallery() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Impact photos</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Real work. Real people.</h2>
            <p className="mt-2 max-w-2xl text-sm text-mutedInk md:text-base">
              These are the communities we serve — youth, women, and children — through training, mentoring, and responsible lending.
            </p>
          </div>

          <Link
            href="/impact"
            className="hidden rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02] md:inline-flex"
          >
            View Impact
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <Link
              key={it.title}
              href={it.href}
              className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={it.src}
                  alt={it.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority={false}
                />
              </div>

              <div className="p-5">
                <div className="text-base font-semibold tracking-tight">{it.title}</div>
                <div className="mt-1 text-sm text-mutedInk">{it.subtitle}</div>
                <div className="mt-4 text-sm font-semibold">
                  Learn more <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link
            href="/impact"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold hover:bg-black/[0.02]"
          >
            View Impact
          </Link>
        </div>
      </Container>
    </section>
  );
}