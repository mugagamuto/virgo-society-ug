import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure node runtime for Resend

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;

  // Lazy import so build doesn't crash when key is missing
  const { Resend } = require("resend") as typeof import("resend");
  return new Resend(key);
}

export async function POST(req: Request) {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY is missing" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // TODO: adapt these fields to your payload format
    const to = body?.to;
    const subject = body?.subject ?? "Virgo Society";
    const html = body?.html ?? "<p>Hello</p>";
    const from = body?.from ?? "Virgo Society <no-reply@virgosociety.org>";

    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Missing 'to' in request body" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed" },
      { status: 500 }
    );
  }
}
