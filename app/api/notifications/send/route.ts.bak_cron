export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

type OutboxRow = {
  id: number;
  created_at: string;
  to_email: string;
  template: string | null;
  payload: any | null;
  event: string | null;
  sent_at: string | null;
};

const resend = new Resend(process.env.RESEND_API_KEY!);

function wrapEmail(title: string, subtitle: string, bodyHtml: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;background:#f6fdf9;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0b1220;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:18px;overflow:hidden;">
        <tr>
          <td style="padding:20px 20px 14px;background:linear-gradient(135deg,#0f766e,#059669);color:#fff;">
            <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;opacity:.95;">Virgo Building Society</div>
            <div style="margin-top:6px;font-size:22px;font-weight:900;line-height:1.2;">${title}</div>
            <div style="margin-top:6px;font-size:13px;opacity:.9;">${subtitle}</div>
          </td>
        </tr>
        <tr><td style="padding:20px;">${bodyHtml}</td></tr>
        <tr>
          <td style="padding:12px 20px;border-top:1px solid rgba(0,0,0,.06);font-size:12px;color:#64748b;">
            www.virgosociety.org
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function primaryButton(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:800;">${label}</a>`;
}

function renderFromRow(row: OutboxRow) {
  const dash = "https://www.virgosociety.org/members/dashboard";
  const payload = row.payload || {};
  const projectTitle = payload.project_title || payload.title || "your project";
  const reason = payload.reason || payload.note || payload.admin_note || "";
  const memberName = payload.member_name || payload.name || "there";
  const key = (row.template || row.event || "").toLowerCase().trim();

  if (key === "member_welcome") {
    return {
      subject: "Welcome to Virgo Building Society",
      html: wrapEmail(
        "Welcome to Virgo Building Society",
        "Your dashboard is ready",
        `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
          Hi <b>${memberName}</b>, your account has been created successfully.
        </p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
          You can now log in, create projects, and track funding progress from your member dashboard.
        </p>
        <div style="margin-top:16px;">${primaryButton(dash, "Open dashboard")}</div>`
      ),
    };
  }

  if (key === "project_submitted") {
    return {
      subject: "Project submitted - awaiting approval",
      html: wrapEmail(
        "Project submitted",
        "Awaiting admin approval",
        `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
          We received <b>${projectTitle}</b>. Admin will review and verify details before approval.
        </p>
        <div style="margin-top:16px;">${primaryButton(dash, "View dashboard")}</div>`
      ),
    };
  }

  if (key === "project_approved") {
    return {
      subject: "Good news - your project was approved",
      html: wrapEmail(
        "Project approved",
        "Next step: publishing",
        `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
          <b>${projectTitle}</b> has been approved and will be published for donors.
        </p>
        <div style="margin-top:16px;">${primaryButton(dash, "Open dashboard")}</div>`
      ),
    };
  }

  if (key === "project_rejected") {
    const extra = reason
      ? `<p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#64748b;"><b>Reason:</b> ${reason}</p>`
      : "";
    return {
      subject: "Project update - not approved",
      html: wrapEmail(
        "Project not approved",
        "Please review feedback and resubmit",
        `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
          <b>${projectTitle}</b> was not approved at this time. Please review admin notes in your dashboard and resubmit.
        </p>
        ${extra}
        <div style="margin-top:16px;">${primaryButton(dash, "View dashboard")}</div>`
      ),
    };
  }

  if (key === "project_funded") {
    return {
      subject: "Congratulations - your project is funded",
      html: wrapEmail(
        "Project funded",
        "Thank you for your work",
        `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
          Great news - <b>${projectTitle}</b> has been marked as funded. Please keep progress updates ready.
        </p>
        <div style="margin-top:16px;">${primaryButton(dash, "Go to dashboard")}</div>`
      ),
    };
  }

  return {
    subject: "Virgo Building Society - Update",
    html: wrapEmail(
      "Update",
      "Check your dashboard",
      `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
        There is an update on your account. Please check your dashboard.
      </p>
      <div style="margin-top:16px;">${primaryButton(dash, "Open dashboard")}</div>`
    ),
  };
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const from = process.env.MAIL_FROM || "Virgo Building Society <no-reply@virgosociety.org>";
  if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");

  return await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !service) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  return createClient(url, service, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const secret = process.env.NOTIFICATIONS_CRON_SECRET || process.env.CRON_SECRET;
    if (!secret) throw new Error("Missing NOTIFICATIONS_CRON_SECRET env var.");

    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("notification_outbox")
      .select("id, created_at, to_email, template, payload, event, sent_at")
      .is("sent_at", null)
      .order("created_at", { ascending: true })
      .limit(25);

    if (error) throw error;

    const rows = (data || []) as OutboxRow[];
    let sent = 0;
    const results: Array<{ id: number; ok: boolean; error?: string }> = [];

    for (const row of rows) {
      try {
        const t = renderFromRow(row);
        await sendEmail({
          to: row.to_email,
          subject: t.subject,
          html: t.html,
        });

        const { error: upErr } = await supabase
          .from("notification_outbox")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", row.id);

        if (upErr) throw upErr;

        sent++;
        results.push({ id: row.id, ok: true });
      } catch (e: any) {
        results.push({ id: row.id, ok: false, error: e?.message || String(e) });
      }
    }

    return NextResponse.json({ ok: true, queued: rows.length, sent, results });
  } catch (e: any) {
    console.error("notifications/send error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || String(e), stack: e?.stack || null },
      { status: 500 }
    );
  }
}
