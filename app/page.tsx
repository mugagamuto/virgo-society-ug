export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";

type Section =
  | { type: "hero"; eyebrow?: string; title: string; subtitle?: string }
  | { type: "highlights"; items: { title: string; body?: string }[] }
  | {
      type: "cta";
      title: string;
      subtitle?: string;
      primaryLabel?: string;
      primaryHref?: string;
      secondaryLabel?: string;
      secondaryHref?: string;
    }
  | { type: string; [k: string]: any };

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

async function getHome() {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("pages")
    .select("title, sections")
    .eq("slug", "home")
    .maybeSingle();

  return {
    title: data?.title ?? "Virgo Building Society",
    sections: (data?.sections ?? []) as Section[],
  };
}

function Highlights({ items }: { items: { title: string; body?: string }[] }) {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((it, idx) => (
            <div key={idx} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold tracking-tight">{it.title}</div>
              {it.body ? <div className="mt-2 text-sm text-mutedInk">{it.body}</div> : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default async function HomePage() {
  const { title, sections } = await getHome();

  const hero = sections.find((s) => s.type === "hero") as any;

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Uganda"}
        title={hero?.title ?? title}
        subtitle={hero?.subtitle ?? "Empowering youth, women, and communities to build sustainable incomes in Uganda."}
      />

      {sections.map((s, idx) => {
        if (s.type === "highlights") {
          return <Highlights key={idx} items={(s as any).items ?? []} />;
        }

        if (s.type === "cta") {
          const c = s as any;
          return (
            <div key={idx} className="pb-12 md:pb-16">
              <CtaBand
                title={c.title}
                subtitle={c.subtitle}
                primary={{ label: c.primaryLabel ?? "Apply for support", href: c.primaryHref ?? "/apply" }}
                secondary={{ label: c.secondaryLabel ?? "Donate", href: c.secondaryHref ?? "/donate" }}
              />
            </div>
          );
        }

        return null;
      })}

      {/* Small fallback if sections are empty */}
      {sections.length === 0 ? (
        <section className="py-12 md:py-16">
          <Container>
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
              <div className="text-lg font-semibold tracking-tight">Homepage content not set yet</div>
              <p className="mt-2 text-sm text-mutedInk">
                Go to <Link className="underline" href="/admin/pages/home">Admin → Pages → Home</Link> and add sections JSON.
              </p>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}