import Link from "next/link";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";

export default function DonorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Donors"
        title="Support youth, women, and communities"
        subtitle="Your contribution helps Virgo Building Society deliver training, mentorship, and affordable support to registered groups and community initiatives."
      />

      <Container className="py-12 md:py-16">
        <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
          <h2 className="text-lg font-semibold">How to support</h2>
          <p className="mt-2 text-sm text-mutedInk">
            Use any option below. After supporting, you can WhatsApp us a screenshot for confirmation.
          </p>

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
            <Link
              href="/contact"
              className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Contact us
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.03]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
