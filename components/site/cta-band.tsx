import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

type CtaLink = { label: string; href: string };

export function CtaBand(props?: {
  title?: string;
  subtitle?: string;
  primary?: CtaLink;
  secondary?: CtaLink;
}) {
  const title = props?.title ?? "Join the mission";
  const subtitle =
    props?.subtitle ??
    "Support youth, women, and children in Uganda through training, mentorship, and responsible community finance.";

  const primary = props?.primary ?? { label: "Donate", href: "/donate" };
  const secondary = props?.secondary ?? { label: "Apply for support", href: "/apply" };

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm md:p-10">
          <div className="grid gap-6 md:grid-cols-[1.4fr_0.6fr] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
              <p className="mt-2 text-sm text-mutedInk md:text-base">{subtitle}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
              <Link href={primary.href} className="w-full">
                <Button className="w-full" variant="primary">
                  {primary.label}
                </Button>
              </Link>

              <Link href={secondary.href} className="w-full">
                <Button className="w-full" variant="secondary">
                  {secondary.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}