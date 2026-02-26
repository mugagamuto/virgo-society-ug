import Link from "next/link";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";

export default function DonorProjectDetail({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <>
      <PageHero
        eyebrow="Fund a Project"
        title="Project funding details"
        subtitle="This page is ready. Next step is to connect projects to your Supabase data so each approved application can appear here."
      />

      <Container className="py-12 md:py-16">
        <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
          <div className="text-sm text-mutedInk">Project ID</div>
          <div className="mt-1 text-lg font-semibold">{id}</div>

          <div className="mt-4 text-sm text-mutedInk">
            For now, donors can contact you to fund this project (MOMO/Bank). Later we can add payment links and receipts.
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-5">
              <div className="text-sm font-semibold">Mobile Money (UG)</div>
              <div className="mt-2 text-sm text-mutedInk">MTN: ____________</div>
              <div className="text-sm text-mutedInk">Airtel: ____________</div>
            </div>

            <div className="rounded-2xl border border-black/10 p-5">
              <div className="text-sm font-semibold">Bank Transfer</div>
              <div className="mt-2 text-sm text-mutedInk">Bank: ____________</div>
              <div className="text-sm text-mutedInk">A/C Name: Virgo Building Society</div>
              <div className="text-sm text-mutedInk">A/C No: ____________</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/donors" className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.03]">
              ← Back to projects
            </Link>
            <Link href="/donate" className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
              Donate to organization
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
