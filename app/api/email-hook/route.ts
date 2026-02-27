import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function safeStr(v: any) {
  return typeof v === "string" ? v : "";
}

type HookPayload = {
  type?: "INSERT" | "UPDATE" | "DELETE";
  table?: string;
  schema?: string;
  record?: any;
  old_record?: any;
  new?: any;
  old?: any;
};

function getRecord(p: HookPayload) {
  return p.record ?? p.new ?? null;
}
function getOldRecord(p: HookPayload) {
  return p.old_record ?? p.old ?? null;
}

export async function POST(req: Request) {
  try {
    const secret = mustEnv("SUPABASE_WEBHOOK_SECRET");
    const sig = req.headers.get("x-hook-secret") || "";
    if (sig !== secret) return json(401, { error: "Unauthorized" });

    const payload = (await req.json()) as HookPayload;
    const type = payload.type || "UPDATE";
    const table = payload.table || "";
    const record = getRecord(payload);
    const old = getOldRecord(payload);

    const from = mustEnv("EMAIL_FROM");
    const adminEmail = mustEnv("ADMIN_EMAIL");

    // 1) Member registration
    if (table === "members" && type === "INSERT") {
      const email = safeStr(record?.email);
      const org = safeStr(record?.org_name);

      if (email) {
        await resend.emails.send({
          from,
          to: [email],
          subject: "Welcome to Virgo Society Member Portal",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6">
              <h2>Welcome ${org ? `— ${org}` : ""}</h2>
              <p>Your member account has been created successfully.</p>
              <p>Log in: <a href="https://virgosociety.org/members/login">virgosociety.org/members/login</a></p>
              <p style="margin-top:18px">— Virgo Building Society</p>
            </div>
          `,
        });
      }

      await resend.emails.send({
        from,
        to: [adminEmail],
        subject: "New member registration",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h3>New member registration</h3>
            <p><b>Org:</b> ${org || "—"}</p>
            <p><b>Email:</b> ${email || "—"}</p>
          </div>
        `,
      });

      return json(200, { ok: true, handled: "members_insert" });
    }

    // 2) Project submitted / updated
    if (table === "projects") {
      const applicantEmail =
        safeStr(record?.email) ||
        safeStr(record?.contact_email) ||
        safeStr(record?.member_email);

      const title = safeStr(record?.title);
      const statusNow = safeStr(record?.status);
      const statusOld = safeStr(old?.status);

      if (type === "INSERT") {
        if (applicantEmail) {
          await resend.emails.send({
            from,
            to: [applicantEmail],
            subject: "Project application received",
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">
                <h2>We received your project application</h2>
                <p><b>Project:</b> ${title || "—"}</p>
                <p>Status: <b>${statusNow || "submitted"}</b></p>
                <p>Track progress in your dashboard.</p>
                <p style="margin-top:18px">— Virgo Building Society</p>
              </div>
            `,
          });
        }

        await resend.emails.send({
          from,
          to: [adminEmail],
          subject: "New project application submitted",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6">
              <h3>New project application</h3>
              <p><b>Project:</b> ${title || "—"}</p>
              <p><b>Status:</b> ${statusNow || "submitted"}</p>
            </div>
          `,
        });

        return json(200, { ok: true, handled: "projects_insert" });
      }

      if (type === "UPDATE" && statusNow && statusNow !== statusOld) {
        if (applicantEmail) {
          const subject =
            statusNow === "approved"
              ? "Your project has been approved"
              : statusNow === "rejected"
              ? "Your project application update"
              : "Your project status update";

          await resend.emails.send({
            from,
            to: [applicantEmail],
            subject,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">
                <h2>Project status updated</h2>
                <p><b>Project:</b> ${title || "—"}</p>
                <p>New status: <b>${statusNow.toUpperCase()}</b></p>
                ${
                  record?.admin_note
                    ? `<p><b>Admin note:</b> ${String(record.admin_note)}</p>`
                    : ""
                }
                <p>Login: <a href="https://virgosociety.org/members/dashboard">Member dashboard</a></p>
                <p style="margin-top:18px">— Virgo Building Society</p>
              </div>
            `,
          });
        }

        return json(200, { ok: true, handled: "projects_status_update" });
      }
    }

    // 3) Project funded (change table name if yours differs)
    if (table === "project_funding" && type === "INSERT") {
      const applicantEmail =
        safeStr(record?.org_email) ||
        safeStr(record?.member_email) ||
        safeStr(record?.email);

      const projectTitle = safeStr(record?.project_title);
      const amount = record?.amount_ugx ?? record?.amount ?? null;

      if (applicantEmail) {
        await resend.emails.send({
          from,
          to: [applicantEmail],
          subject: "Your project has received funding 🎉",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6">
              <h2>Congratulations!</h2>
              <p>Your project has received funding.</p>
              <p><b>Project:</b> ${projectTitle || "—"}</p>
              ${amount ? `<p><b>Amount:</b> ${amount}</p>` : ""}
              <p>Login: <a href="https://virgosociety.org/members/dashboard">Member dashboard</a></p>
              <p style="margin-top:18px">— Virgo Building Society</p>
            </div>
          `,
        });
      }

      await resend.emails.send({
        from,
        to: [adminEmail],
        subject: "A project has been funded",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h3>Funding received</h3>
            <p><b>Project:</b> ${projectTitle || "—"}</p>
            ${amount ? `<p><b>Amount:</b> ${amount}</p>` : ""}
          </div>
        `,
      });

      return json(200, { ok: true, handled: "funding_insert" });
    }

    return json(200, { ok: true, handled: "ignored", table, type });
  } catch (e: any) {
    return json(500, { error: e?.message ?? "Server error" });
  }
}
