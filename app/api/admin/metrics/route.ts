import { NextResponse, NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

async function countExact(sb: any, table: string, filter?: (q: any) => any) {
  let q = sb.from(table).select("user_id", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

async function countExactById(sb: any, table: string, filter?: (q: any) => any) {
  let q = sb.from(table).select("id", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

async function sumDonations(sb: any, status?: string) {
  let q = sb.from("donations").select("amount_ugx");
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  const total = (data ?? []).reduce((s: number, r: any) => s + Number(r.amount_ugx ?? 0), 0);
  return total;
}

export async function GET(_req: NextRequest) {
  const { sb, error } = getSupabaseAdmin();
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });

  try {
    const [
      members_total,
      members_active,
      members_suspended,

      apps_pending,
      apps_approved,
      apps_rejected,

      projects_total,
      projects_fundable,

      pledged_total,
      pledged_paid,
      pledged_pending,
    ] = await Promise.all([
      countExact(sb as any, "members"),
      countExact(sb as any, "members", (q) => q.eq("status", "active")),
      countExact(sb as any, "members", (q) => q.eq("status", "suspended")),

      countExactById(sb as any, "support_applications", (q) => q.eq("status", "pending")),
      countExactById(sb as any, "support_applications", (q) => q.eq("status", "approved")),
      countExactById(sb as any, "support_applications", (q) => q.eq("status", "rejected")),

      countExactById(sb as any, "projects"),
      countExactById(sb as any, "projects", (q) => q.eq("is_fundable", true)),

      sumDonations(sb as any),
      sumDonations(sb as any, "paid"),
      sumDonations(sb as any, "pending"),
    ]);

    return NextResponse.json({
      ok: true,
      metrics: {
        members: { total: members_total, active: members_active, suspended: members_suspended },
        applications: { pending: apps_pending, approved: apps_approved, rejected: apps_rejected },
        projects: { total: projects_total, fundable: projects_fundable },
        funding: { pledged_total, pledged_paid, pledged_pending },
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}