"use client";

import React from "react";

export default function SupportApplicationFormPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Support Application Form</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Print this page and fill it, or Print → Save as PDF.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Print / Save as PDF
          </button>
        </div>

        <div className="mt-6 rounded-2xl border p-6 print:border-0 print:p-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold">VIRGO BUILDING SOCIETY</div>
              <div className="text-xs text-neutral-500">Support Application Form • vigosociety.org</div>
              <div className="mt-3 h-1 w-full rounded-full bg-emerald-800" />
            </div>

            <div className="text-right">
              <div className="text-xs text-neutral-500">Passport Photo</div>
              <div className="mt-2 h-24 w-36 rounded-xl border border-dashed" />
            </div>
          </div>

          <Section title="A) GROUP / ORGANISATION DETAILS" />
          <Grid2>
            <Field label="Group / Organisation Name" />
            <Field label="Registration Number (if any)" />
            <Field label="Location (Town / Village)" />
            <Field label="District" />
            <Field label="Number of Members" />
            <Field label="Main Activity / Business" />
          </Grid2>

          <Section title="B) CONTACT PERSON" />
          <Grid2>
            <Field label="Full Name" />
            <Field label="Role in Group" />
            <Field label="Phone" />
            <Field label="Email" />
            <Field label="Physical Address" full />
          </Grid2>

          <Section title="C) SUPPORT REQUEST" />
          <Grid2>
            <Field label="Type of Support (tick)" big />
            <Field label="Amount Requested (UGX)" />
            <Field label="Purpose / How funds will be used" big full />
            <Field label="Expected impact (members/community)" big full />
          </Grid2>

          <Section title="D) REQUIRED ATTACHMENTS (tick when attached)" />
          <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-neutral-700">
            <div>□ Registration Form (filled & signed)</div>
            <div>□ Registration Documents (certificate/bylaws/minutes)</div>
            <div>□ NIN / ID (contact person)</div>
            <div>□ Passport Photo</div>
          </div>

          <Section title="E) DECLARATION" />
          <p className="text-sm text-neutral-700">
            I declare that the information provided is true and correct. I understand that Virgo Building Society may
            verify the information and request additional documents.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <Field label="Name" />
            <Field label="Signature" />
            <Field label="Date" />
          </div>

          <div className="mt-6 text-xs text-neutral-500">
            Confidential: For official use only • vigosociety.org
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title }: { title: string }) {
  return <h2 className="mt-6 text-sm font-semibold tracking-tight text-emerald-900">{title}</h2>;
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  full,
  big,
}: {
  label: string;
  full?: boolean;
  big?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-xs font-medium text-neutral-600">{label}</div>
      <div className={`mt-2 rounded-xl border ${big ? "h-20" : "h-10"}`} />
    </div>
  );
}
