export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

async function getSettings(keys: string[]) {
  const supabase = supabaseServer();
  const { data } = await supabase.from("site_settings").select("key,value").in("key", keys);
  const map: Record<string, string> = {};
  (data ?? []).forEach((r: any) => (map[r.key] = r.value));
  return map;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-base font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-mutedInk">{children}</div>
    </div>
  );
}

export default async function DonatePage() {
  const s = await getSettings(["momo_number", "bank_details", "whatsapp", "email"]);

  const wa = (s.whatsapp ?? "256755077903").replace(/\D/g, "");
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent("Hello Virgo Building Society. I would like to support/donate.")}`;

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Donate to Virgo Building Society"
        subtitle="Your support helps youth and women groups access training, financial skills, and low-interest loans, and strengthens child-focused community programs."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Mobile Money (MoMo)">
            <div className="font-medium text-black">{s.momo_number ?? "MTN MoMo: 256755077903"}</div>
            <div className="mt-2">
              Send your donation and WhatsApp us the transaction message for confirmation.
            </div>
          </Card>

          <Card title="Bank Transfer">
            <div className="whitespace-pre-line font-medium text-black">
              {s.bank_details ?? "Bank: (Add your bank details in Admin → Settings)"}
            </div>
            <div className="mt-2">Email proof to: <span className="font-medium text-black">{s.email ?? "info@virgosociety.org"}</span></div>
          </Card>

          <div className="md:col-span-2 rounded-3xl border border-black/10 bg-black/[0.02] p-6">
            <div className="text-base font-semibold tracking-tight">Need a receipt or donor letter?</div>
            <div className="mt-2 text-sm text-mutedInk">
              WhatsApp us and we’ll respond quickly.
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={waLink}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                WhatsApp us
              </Link>

              <Link
                href="/impact"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/[0.02]"
              >
                See our impact
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}