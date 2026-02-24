import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { ApplicationForm } from "@/components/site/application-form";

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply for support"
        title="Grow your group or startup with training and affordable support"
        subtitle="Virgo Building Society supports registered youth and women groups, startups, and community initiatives through financial skills training, mentorship, and low-interest member loans. Fill in the form below and our team will follow up."
      />

      <Container className="py-12 md:py-16">
        <ApplicationForm />
      </Container>
    </>
  );
}
