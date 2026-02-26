import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !anon || !service) {
      return json(500, {
        error:
          "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.",
      });
    }

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return json(401, { error: "Missing Authorization Bearer token" });

    const body = await req.json();
    const email = body?.email;
    if (!email || typeof email !== "string") return json(400, { error: "Missing email" });

    // Verify requester identity using anon client
    const anonClient = createClient(url, anon);
    const { data: userRes, error: userErr } = await anonClient.auth.getUser(token);
    if (userErr || !userRes?.user) return json(401, { error: "Invalid session" });

    const requesterId = userRes.user.id;

    // Verify requester is admin using service role
    const adminClient = createClient(url, service);
    const { data: adminRow, error: adminErr } = await adminClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", requesterId)
      .maybeSingle();

    if (adminErr) return json(500, { error: adminErr.message });
    if (!adminRow) return json(403, { error: "Not an admin" });

    // Generate password recovery link
    const redirectTo = "https://vigosociety.org/members/reset-password";
    const { data, error } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (error) return json(500, { error: error.message });

    const actionLink = data?.properties?.action_link ?? null;
    if (!actionLink) return json(500, { error: "No action_link returned by Supabase" });

    return json(200, { action_link: actionLink });
  } catch (e: any) {
    return json(500, { error: e?.message ?? "Server error" });
  }
}
