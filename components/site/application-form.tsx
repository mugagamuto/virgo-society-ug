"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type FormState = {
  orgName: string;
  contactName: string;
  phone: string;
  email: string;
  district: string;
  orgType: string;
  registered: string;
  members: string;
  supportNeeds: string;
  message: string;
};

const initial: FormState = {
  orgName: "",
  contactName: "",
  phone: "",
  email: "",
  district: "",
  orgType: "",
  registered: "",
  members: "",
  supportNeeds: "",
  message: "",
};

export function ApplicationForm() {
  const [data, setData] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);

  const subject = useMemo(() => {
    const name = data.orgName?.trim() || "New Application";
    return encodeURIComponent("Support Application - " + name);
  }, [data.orgName]);

  const body = useMemo(() => {
    const lines = [
      "Support Application (Website)",
      "",
      "Organization / Group Name: " + (data.orgName || "-"),
      "Contact Person: " + (data.contactName || "-"),
      "Phone: " + (data.phone || "-"),
      "Email: " + (data.email || "-"),
      "District: " + (data.district || "-"),
      "Type: " + (data.orgType || "-"),
      "Registered: " + (data.registered || "-"),
      "Members (approx): " + (data.members || "-"),
      "Support Needed: " + (data.supportNeeds || "-"),
      "",
      "Message:",
      data.message || "-",
      "",
      "Sent from Virgo Building Society website.",
    ];
    return encodeURIComponent(lines.join("\n"));
  }, [data]);

  const mailto = useMemo(() => {
    // TODO: replace with your official email
    const to = "info@yourdomain.com";
    return mailto:?subject=&body=;
  }, [subject, body]);

  const requiredOk =
    data.orgName.trim().length > 1 &&
    data.contactName.trim().length > 1 &&
    data.phone.trim().length > 5 &&
    data.district.trim().length > 1 &&
    data.supportNeeds.trim().length > 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
      <Card className="border-black/10">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Application form</CardTitle>
              <CardDescription className="mt-1">
                Fill this in and submit. We will contact you within 2-5 working days.
              </CardDescription>
            </div>
            <Badge>For youth & women groups</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Group / Startup name *</div>
              <Input
                value={data.orgName}
                onChange={(e) => setData({ ...data, orgName: e.target.value })}
                placeholder="e.g. Kawaala Youth Savings Group"
              />
            </div>

            <div>
              <div className="text-sm font-medium">Contact person *</div>
              <Input
                value={data.contactName}
                onChange={(e) => setData({ ...data, contactName: e.target.value })}
                placeholder="Full name"
              />
            </div>

            <div>
              <div className="text-sm font-medium">Phone number *</div>
              <Input
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="+256 7XX XXX XXX"
              />
            </div>

            <div>
              <div className="text-sm font-medium">Email (optional)</div>
              <Input
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="name@email.com"
              />
            </div>

            <div>
              <div className="text-sm font-medium">District *</div>
              <Input
                value={data.district}
                onChange={(e) => setData({ ...data, district: e.target.value })}
                placeholder="Kampala, Wakiso, Mukono..."
              />
            </div>

            <div>
              <div className="text-sm font-medium">Type (choose one)</div>
              <Input
                value={data.orgType}
                onChange={(e) => setData({ ...data, orgType: e.target.value })}
                placeholder="Youth group / Women group / Startup / SACCO"
              />
            </div>

            <div>
              <div className="text-sm font-medium">Registered?</div>
              <Input
                value={data.registered}
                onChange={(e) => setData({ ...data, registered: e.target.value })}
                placeholder="Yes / No / In progress"
              />
            </div>

            <div>
              <div className="text-sm font-medium">Members (approx)</div>
              <Input
                value={data.members}
                onChange={(e) => setData({ ...data, members: e.target.value })}
                placeholder="e.g. 15"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-sm font-medium">Support needed *</div>
              <Input
                value={data.supportNeeds}
                onChange={(e) => setData({ ...data, supportNeeds: e.target.value })}
                placeholder="Training / Mentorship / Loan / Business tools / Children support"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-sm font-medium">Short message</div>
              <Textarea
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
                placeholder="Briefly explain your project, challenges, and what support you need."
                rows={6}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              disabled={!requiredOk}
              onClick={() => {
                window.location.href = mailto;
                setSent(true);
              }}
            >
              Submit application
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setData(initial);
                setSent(false);
              }}
            >
              Clear
            </Button>

            {sent ? (
              <div className="text-sm text-mutedInk">
                If your email app did not open, copy your details and send to our contact email.
              </div>
            ) : null}
          </div>

          <div className="mt-4 text-xs text-mutedInk">
            Note: Replace <strong>info@yourdomain.com</strong> in the form with your official email address.
          </div>
        </CardContent>
      </Card>

      <Card className="border-black/10">
        <CardContent className="p-6 md:p-8">
          <CardTitle>What we support</CardTitle>
          <CardDescription className="mt-1">
            This helps applicants understand what to request.
          </CardDescription>

          <ul className="mt-5 space-y-3 text-sm text-mutedInk">
            <li><strong>Financial skills:</strong> budgeting, record keeping, savings discipline.</li>
            <li><strong>Mentorship:</strong> business guidance, goal setting, follow-ups.</li>
            <li><strong>Affordable member loans:</strong> low interest, clear repayment terms.</li>
            <li><strong>Children support:</strong> targeted welfare and education support where needed.</li>
            <li><strong>Donor partnership:</strong> program support for wider community impact.</li>
          </ul>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm">
            <div className="font-semibold">Tip for applicants</div>
            <div className="mt-1 text-mutedInk">
              Share what you already do, your members count, and how support will improve income.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
