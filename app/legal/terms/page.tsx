import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use (Template)"
        subtitle="Replace this template with your official terms. This site is a marketing and information website for Virgo Building Society Uganda."
      />
      <Container className="py-12 md:py-16">
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft text-sm text-mutedInk space-y-4">
          <p>
            By using this site you agree to the terms set by Virgo Building Society Uganda. This is a placeholder and should be customized.
          </p>
          <p>
            You may add clauses about donations, content usage, disclaimers, and contact details as required.
          </p>
        </div>
      </Container>
    </>
  );
}



