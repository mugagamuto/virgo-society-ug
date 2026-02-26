"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string;
  problem_summary: string;
  budget_ugx: number;
  status: string;
};

function fmt(n: number) {
  try { return new Intl.NumberFormat("en-UG").format(n); } catch { return String(n); }
}

export default function DonorProjectPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [p, setP] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase
      .from("funding_projects")
      .select("id,title,problem_summary,budget_ugx,status")
      .eq("id", id)
      .single();

    if (error) { setMsg(error.message); setLoading(false); return; }
    setP(data as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function pledge(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!p) return;
    if (!name.trim()) return setMsg("Enter your name.");
    if (!email.trim() || !email.includes("@")) return setMsg("Enter a valid email.");

    setSending(true);

    const amt = amount.trim() ? Number(amount) : null;

    const { error: insErr } = await supabase.from("funding_pledges").insert({
      project_id: p.id,
      donor_name: name.trim(),
      donor_email: email.trim().toLowerCase(),
      donor_phone: phone.trim() || null,
      amount_ugx: Number.isFinite(amt as any) ? amt : null,
      message: note.trim() || null,
      status: "new",
    });

    if (insErr) {
      setSending(false);
      return setMsg(insErr.message);
    }

    // mark project as pledged (so admin can prioritize)
    if (p.status === "open") {
      await supabase.from("funding_projects").update({ status: "pledged", pledged_at: new Date().toISOString() }).eq("id", p.id);
    }

    setSending(false);
    setMsg("✅ Thank you! We’ve received your interest. Our team will contact you to arrange funding.");
    setName(""); setEmail(""); setPhone(""); setAmount(""); setNote("");
    load();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/donors" className="text-sm text-neutral-600 hover:underline">← Back to projects</Link>

        {loading ? (
          <div className="mt-6 rounded-2xl border p-6 text-sm text-neutral-600">Loading…</div>
        ) : !p ? (
          <div className="mt-6 rounded-2xl border p-6 text-sm text-neutral-600">Project not found.</div>
        ) : (
          <>
            <div className="mt-6 rounded-3xl border p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
                <span className="rounded-full border px-3 py-1 text-xs font-semibold">{p.status.toUpperCase()}</span>
              </div>
              <p className="mt-3 text-sm text-neutral-700 whitespace-pre-line">{p.problem_summary}</p>
              <div className="mt-4 text-sm font-semibold">Budget: UGX {fmt(p.budget_ugx)}</div>
            </div>

            <div className="mt-6 rounded-3xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Fund this project</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Fill this form and our admin will contact you to arrange funding (no payments are taken on the website).
              </p>

              <form onSubmit={pledge} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Your name</label>
                    <input className="mt-2 w-full rounded-xl border px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input className="mt-2 w-full rounded-xl border px-4 py-3" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Phone (optional)</label>
                    <input className="mt-2 w-full rounded-xl border px-4 py-3" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount (UGX, optional)</label>
                    <input className="mt-2 w-full rounded-xl border px-4 py-3" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Message (optional)</label>
                  <textarea className="mt-2 w-full rounded-xl border px-4 py-3" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
                </div>

                <button disabled={sending} className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
                  {sending ? "Submitting…" : "Submit interest"}
                </button>

                {msg ? <p className="rounded-xl border bg-neutral-50 px-4 py-3 text-sm">{msg}</p> : null}
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
