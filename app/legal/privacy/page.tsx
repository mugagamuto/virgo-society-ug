import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy (Template)"
        subtitle="Replace this template with your official policy. This site currently collects no personal data by default unless you connect the contact form to a backend."
      />
      <Container className="py-12 md:py-16">
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft text-sm text-mutedInk space-y-4">
          <p>
            Virgo Building Society Uganda respects your privacy. This template is provided for convenience and must be reviewed by your legal advisor.
          </p>
          <p>
            If you add analytics, forms, or payment providers, update this page to explain what data is collected, why, and how it is stored.
          </p>
        </div>
      </Container>
    </>
  );
}

