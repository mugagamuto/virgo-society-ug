export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function processQueue() {

  const supabase = getSupabase();

  const { data } = await supabase
    .from("notification_outbox")
    .select("*")
    .is("sent_at", null)
    .limit(20);

  let sent = 0;

  for (const row of data || []) {

    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: row.to_email,
      subject: "Virgo Building Society Notification",
      html: `<p>You have a new notification.</p>`
    });

    await supabase
      .from("notification_outbox")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", row.id);

    sent++;
  }

  return {
    ok: true,
    queued: data?.length || 0,
    sent
  };
}

async function handler(req: Request) {

  const secret =
    process.env.NOTIFICATIONS_CRON_SECRET ||
    process.env.CRON_SECRET;

  const auth = req.headers.get("authorization") || "";

  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const result = await processQueue();

  return NextResponse.json(result);
}

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}
