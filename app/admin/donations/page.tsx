"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

type DocRow = { id: string; doc_type: string; file_path: string; original_name: string; created_at: string };
type BudgetItem = { item: string; amount_ugx: string };

async function safeJson(res: Response) {
  const text = await res.text();
  try { return { json: JSON.parse(text), text }; } catch { return { json: null as any, text }; }
}

function fmtUgx(n?: number | null) {
  const v = Number(n ?? 0);
  return `UGX ${Number.isFinite(v) ? v.toLocaleString() : "0"}`;
}

export default function MemberProjectDetail() {
  const params = useParams();
  const raw = (params as any)?.id;
  const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [project, setProject] = useState<any>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);

  // Upload docs
  const [docType, setDocType] = useState("national_id");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Public proposal + budget
  const [proposalText, setProposalText] = useState("");
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [savingPublic, setSavingPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const budgetTotal = useMemo(() => {
    return budgetItems.reduce((sum, b) => {
      const n = Number(String(b.amount_ugx || "").replace(/,/g, ""));
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
  }, [budgetItems]);

  function hydrateBudget(bb: any): BudgetItem[] {
    try {
      const arr = Array.isArray(bb) ? bb : bb ? JSON.parse(bb) : [];
      if (!Array.isArray(arr)) return [];
      return arr.map((x: any) => ({ item: String(x?.item ?? ""), amount_ugx: String(x?.amount_ugx ?? "") }));
    } catch {
      return [];
    }
  }

  async function load() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const { data: p, error: pErr } = await (supabase as any)
        .from("projects")
        .select("id,owner_id,title,org_name,district,stage,status,budget_ugx,goal_ugx,funded_ugx,description,goals,proposal_text,budget_breakdown")
        .eq("id", id)
        .maybeSingle();

      if (pErr) throw pErr;
      if (!p) throw new Error("Project not found.");
      setProject(p);

      setProposalText(p.proposal_text ?? "");
      const hyd = hydrateBudget(p.budget_breakdown);
      setBudgetItems(hyd.length ? hyd : [{ item: "Training materials", amount_ugx: "1500000" }, { item: "Starter kits", amount_ugx: "2500000" }]);

      const { data: d, error: dErr } = await (supabase as any)
        .from("project_documents")
        .select("id,doc_type,file_path,original_name,created_at")
        .eq("project_id", id)
        .order("created_at", { ascending: false });

      if (dErr) throw dErr;
      setDocs(d ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load project.");
    } finally {
      setLoading(false);
    }
  }

  function setBudgetField(i: number, key: "item" | "amount_ugx", value: string) {
    setBudgetItems((prev) => prev.map((b, idx) => (idx === i ? { ...b, [key]: value } : b)));
  }
  function addBudgetLine() {
    setBudgetItems((prev) => [...prev, { item: "", amount_ugx: "" }]);
  }
  function removeBudgetLine(i: number) {
    setBudgetItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function savePublicInfo() {
    setMsg(null);
    setErr(null);

    try {
      const { data: sess, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      const userId = sess?.session?.user?.id;
      if (!userId) throw new Error("Please log in again.");

      setSavingPublic(true);

      const cleaned = budgetItems
        .map((b) => ({
          item: b.item.trim(),
          amount_ugx: Number(String(b.amount_ugx || "").replace(/,/g, "")) || 0,
        }))
        .filter((b) => b.item.length > 0 && b.amount_ugx > 0);

      const payload: any = {
        proposal_text: proposalText.trim() || null,
        budget_breakdown: cleaned,
        budget_ugx: cleaned.reduce((s, x) => s + (x.amount_ugx || 0), 0) || project?.budget_ugx || null,
      };

      const { error } = await (supabase as any)
        .from("projects")
        .update(payload)
        .eq("id", id)
        .eq("owner_id", userId);

      if (error) throw error;

      setMsg("Saved proposal and budget breakdown ✅");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save.");
    } finally {
      setSavingPublic(false);
    }
  }

  async function uploadDoc(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    try {
      if (!file) return setMsg("Choose a file first.");
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess?.session?.user?.id;
      if (!userId) throw new Error("Please log in again.");

      setUploading(true);

      const form = new FormData();
      form.append("doc_type", docType);
      form.append("file", file);
      form.append("owner_id", userId);

      const res = await fetch(`/api/members/projects/${encodeURIComponent(id)}/upload-doc`, { method: "POST", body: form });
      const { json, text } = await safeJson(res);
      if (!json) throw new Error(`Upload API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
      if (!res.ok || !json.ok) throw new Error(json?.error?.message ?? json?.error ?? "Upload failed");

      setMsg("Uploaded document ✅");
      setFile(null);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submitForReview() {
    setMsg(null);
    setErr(null);

    try {
      const { data: sess } = await supabase.auth.getSession();
      const user = sess?.session?.user;
      if (!user?.id) throw new Error("Please log in again.");

      const cleaned = budgetItems
        .map((b) => ({ item: b.item.trim(), amount: Number(String(b.amount_ugx || "").replace(/,/g, "")) || 0 }))
        .filter((x) => x.item.length > 0 && x.amount > 0);

      if (!proposalText.trim()) throw new Error("Please add a public proposal before submitting.");
      if (cleaned.length === 0) throw new Error("Please add at least one budget breakdown line.");
      if (docs.length === 0) throw new Error("Upload at least 1 supporting document before submitting.");

      setSubmitting(true);

      // Save proposal/budget first
      await savePublicInfo();

      const res = await fetch(`/api/members/projects/${encodeURIComponent(id)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          full_name: user.user_metadata?.full_name ?? "",
          email: user.email ?? "",
          phone: "",
        }),
      });

      const { json, text } = await safeJson(res);
      if (!json) throw new Error(`Submit API returned non-JSON (${res.status}). ${text.slice(0, 200)}`);
      if (!res.ok || !json.ok) throw new Error(json?.error?.message ?? json?.error ?? "Submit failed");

      setMsg("Submitted for admin review ✅");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => { if (id) load(); }, [id]);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project</h1>
          <div className="mt-1 text-sm text-mutedInk">Add proposal + budget, upload docs, then submit for approval.</div>
          <div className="mt-1 text-xs text-mutedInk">ID: {id}</div>
        </div>
        <Link href="/members/dashboard" className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">
          ← Back
        </Link>
      </div>

      {msg ? <div className="rounded-2xl border border-black/10 bg-white p-3 text-sm">{msg}</div> : null}
      {err ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-mutedInk">Loading…</div>
      ) : !project ? (
        <div className="rounded-3xl border border-black/10 bg-white p-5 text-sm text-mutedInk">Project not found.</div>
      ) : (
        <>
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{project.title ?? "Untitled project"}</div>
              <div className="text-xs text-mutedInk">Status: {project.status ?? "—"}</div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Org</div>
                <div className="mt-1 text-sm font-medium">{project.org_name ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">District</div>
                <div className="mt-1 text-sm font-medium">{project.district ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs text-mutedInk">Budget total</div>
                <div className="mt-1 text-sm font-medium">{fmtUgx(budgetTotal)}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-end">
              <button
                disabled={savingPublic}
                onClick={savePublicInfo}
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60"
              >
                {savingPublic ? "Saving…" : "Save Proposal & Budget"}
              </button>
              <button
                disabled={submitting}
                onClick={submitForReview}
                className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit for Admin Approval"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Public Proposal (shown on Fund a Project)</div>
            <textarea
              className="mt-3 w-full rounded-2xl border border-black/10 px-3 py-3 text-sm"
              rows={8}
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              placeholder="Problem, solution, beneficiaries, timeline, and impact."
            />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Public Budget Breakdown (shown on Fund a Project)</div>
              <button onClick={addBudgetLine} className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]">
                + Add line
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {budgetItems.map((b, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-12 items-center rounded-2xl border border-black/10 p-3">
                  <div className="md:col-span-7">
                    <input
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                      value={b.item}
                      onChange={(e) => setBudgetField(i, "item", e.target.value)}
                      placeholder="Item (e.g., Training materials)"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                      value={b.amount_ugx}
                      onChange={(e) => setBudgetField(i, "amount_ugx", e.target.value)}
                      placeholder="Amount UGX"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button onClick={() => removeBudgetLine(i)} className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.03]">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm font-semibold">Total: {fmtUgx(budgetTotal)}</div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Upload Supporting Documents (admin-only verification)</div>

            <form onSubmit={uploadDoc} className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="text-sm font-medium">Document type</label>
                <select className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="national_id">National ID</option>
                  <option value="proposal">Full proposal (PDF)</option>
                  <option value="budget">Budget file</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">File</label>
                <input type="file" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>

              <div className="md:col-span-3">
                <button disabled={uploading || !file} className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60">
                  {uploading ? "Uploading…" : "Upload document"}
                </button>
              </div>
            </form>

            <div className="mt-5">
              <div className="text-sm font-semibold">Uploaded documents</div>
              {docs.length === 0 ? (
                <div className="mt-2 text-sm text-mutedInk">No documents uploaded yet.</div>
              ) : (
                <div className="mt-3 space-y-2">
                  {docs.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-2xl border border-black/10 p-3">
                      <div>
                        <div className="text-sm font-medium">{d.doc_type}</div>
                        <div className="text-xs text-mutedInk">{d.original_name}</div>
                      </div>
                      <div className="text-xs text-mutedInk">{new Date(d.created_at).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}