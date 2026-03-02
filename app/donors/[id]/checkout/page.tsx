"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

async function safeJson(res: Response) {
  const text = await res.text();
  try { return { json: JSON.parse(text), text }; } catch { return { json: null as any, text }; }
}

export default function CheckoutPage() {
  const params = useParams();
  const raw = (params as any)?.id;
  const projectId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const [amount, setAmount] = useState("50000");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("momo");
  const [msg, setMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  async function createPledge() {
    setMsg(null);
    setRef(null);

    const amt = Number(amount.replace(/,/g, ""));
    if (!Number.isFinite(amt) || amt <= 0) return setMsg("Enter a valid amount.");

    setCreating(true);
    try {
      const res = await fetch("/api/donors/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          amount_ugx: amt,
          donor_name: name,
          donor_email: email,
          donor_phone: phone,
          payment_method: method,
        }),
      });

      const { json, text } = await safeJson(res);
      if (!json) throw new Error(`API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
      if (!res.ok || !json.ok) throw new Error(json?.error?.message ?? json?.error ?? "Failed");

      setRef(json.donation.reference);
      setMsg("Pledge created. Use the reference to complete payment.");
    } catch (e: any) {
      setMsg(e?.message ?? "Failed to create pledge.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <Link href={`/donors/${encodeURIComponent(projectId)}`} className="text-sm font-medium hover:underline">
        ← Back to project
      </Link>

      <div className="rounded-3xl border border-black/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Checkout</h1>
        <p className="mt-1 text-sm text-mutedInk">Enter your donation amount and contact details.</p>

        {msg ? <div className="mt-3 rounded-2xl border border-black/10 bg-white p-3 text-sm">{msg}</div> : null}

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Amount (UGX)</label>
            <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Payment method</label>
            <select className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="momo">Mobile Money (MTN/Airtel)</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Your name</label>
            <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+256..." />
          </div>

          <button
            onClick={createPledge}
            disabled={creating}
            className="mt-2 w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {creating ? "Creating…" : "Continue to payment"}
          </button>
        </div>
      </div>

      {ref ? (
        <div className="rounded-3xl border border-black/10 bg-white p-5">
          <div className="text-sm font-semibold">Payment details</div>
          <div className="mt-2 text-sm text-mutedInk">
            Use reference: <span className="font-semibold">{ref}</span>
          </div>

          <div className="mt-3 text-sm">
            <div className="font-medium">Mobile Money (manual for now)</div>
            <div className="text-mutedInk">Send money to: <span className="font-semibold">YOUR MTN/AIRTEL NUMBER</span></div>
            <div className="text-mutedInk">In reason/notes, include: <span className="font-semibold">{ref}</span></div>
          </div>

          <div className="mt-3 text-sm">
            <div className="font-medium">Bank transfer (optional)</div>
            <div className="text-mutedInk">Account: <span className="font-semibold">YOUR BANK DETAILS</span></div>
            <div className="text-mutedInk">Reference: <span className="font-semibold">{ref}</span></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}