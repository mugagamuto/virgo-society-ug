"use client";

import * as React from "react";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export default function ContactPage() {
  const [status, setStatus] = React.useState<"idle" | "sent">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend included by default. Plug in Resend, Formspree, Supabase, etc.
    setStatus("sent");
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to Virgo"
        subtitle="Reach out for membership, loans, training sessions, partnerships, or donor support."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-7">
              <CardTitle>Send a message</CardTitle>
              <CardDescription className="mt-2">
                This form is front-end only. Connect it to email or a database later.
              </CardDescription>

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <div>
                  <label className="text-sm font-medium">Full name</label>
                  <Input required placeholder="Your name" className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email or phone</label>
                  <Input required placeholder="e.g. hello@example.com / +256…" className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea required placeholder="Tell us what you need…" className="mt-2" />
                </div>
                <Button type="submit" className="w-full">Send</Button>
                {status === "sent" && (
                  <div className="text-sm text-brand-800 bg-brand-50 border border-brand-100 rounded-2xl p-3">
                    Message captured (demo). Connect this form to an email service for real delivery.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-soft">
              <div className="text-sm font-semibold">Contact details</div>
              <div className="mt-3 text-sm text-mutedInk space-y-2">
                <div><span className="font-medium text-ink">Address:</span> {site.address}</div>
                <div><span className="font-medium text-ink">Phone:</span> {site.phone}</div>
                <div><span className="font-medium text-ink">Email:</span> {site.email}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-7">
              <div className="text-sm font-semibold">Common enquiries</div>
              <ul className="mt-3 text-sm text-mutedInk list-disc pl-5 space-y-2">
                <li>How to register a youth/women group</li>
                <li>Training session schedules</li>
                <li>Loan eligibility and repayment terms</li>
                <li>Donations & partnerships</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
