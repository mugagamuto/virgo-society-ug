"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

type ProjectRow = {
  id: string;
  owner_id: string;
  owner_email: string | null;
  org_name: string | null;
  members_count: number | null;
  location: string | null;
  district: string | null;
  title: string | null;
  description: string | null;
  goals: string | null;
  stage: string | null;
  budget_ugx: number | null;
  goal_ugx: number | null;
  funded_ugx: number | null;
  amount_raised_ugx: number | null;
  status: string | null;
  submitted_at: string | null;
  admin_note: string | null;
  is_fundable: boolean | null;
  proposal_text: string | null;
  budget_breakdown: any | null;
  proposal_public_url: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string | null;
};

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function fmtUGX(n?: number | null) {
  const v = Number(n ?? 0);
  try {
    return new Intl.NumberFormat("en-UG").format(v);
  } catch {
    return String(v);
  }
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-semibold text-ink">{children}</label>;
}

export default function MemberProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [project, setProject] = useState<ProjectRow | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [stage, setStage] = useState("Planning");
  const [budgetUgx, setBudgetUgx] = useState("0");
  const [goalUgx, setGoalUgx] = useState("0");
  const [proposalText, setProposalText] = useState("");
  const [budgetBreakdownText, setBudgetBreakdownText] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [proposalPublicUrl, setProposalPublicUrl] = useState("");

  async function load() {
    setLoading(true);
    setMsg(null);

    try {
      if (!isUuid(id)) {
        setMsg(`Invalid project id: ${id}`);
        setLoading(false);
        return;
      }

      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;

      const uid = authData?.user?.id;
      if (!uid) {
        router.replace("/members/login?tab=login");
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select(`
          id, owner_id, owner_email, org_name, members_count, location, district,
          title, description, goals, stage, budget_ugx, goal_ugx, funded_ugx,
          amount_raised_ugx, status, submitted_at, admin_note, is_fundable,
          proposal_text, budget_breakdown, proposal_public_url, cover_image_url,
          created_at, updated_at
        `)
        .eq("id", id)
        .eq("owner_id", uid)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setMsg("Project not found.");
        setLoading(false);
        return;
      }

      const p = data as any as ProjectRow;
      setProject(p);
      setTitle(p.title || "");
      setDescription(p.description || "");
      setGoals(p.goals || "");
      setStage(p.stage || "Planning");
      setBudgetUgx(String(Number(p.budget_ugx ?? 0)));
      setGoalUgx(String(Number(p.goal_ugx ?? p.budget_ugx ?? 0)));
      setProposalText(p.proposal_text || "");
      setBudgetBreakdownText(
        p.budget_breakdown ? JSON.stringify(p.budget_breakdown, null, 2) : ""
      );
      setCoverImageUrl(p.cover_image_url || "");
      setProposalPublicUrl(p.proposal_public_url || "");
    } catch (e: any) {
      setMsg(e?.message || "Failed to load project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function uploadCover(file: File) {
    setCoverUploading(true);
    setMsg(null);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${id}-${Date.now()}.${ext}`;
      const filePath = `projects/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from("project-covers")
        .upload(filePath, file, { upsert: true });

      if (upErr) throw upErr;

      const { data } = supabase.storage
        .from("project-covers")
        .getPublicUrl(filePath);

      setCoverImageUrl(data.publicUrl);
    } catch (e: any) {
      setMsg(e?.message || "Failed to upload cover image.");
    } finally {
      setCoverUploading(false);
    }
  }

  async function uploadProposalPdf(file: File) {
    setPdfUploading(true);
    setMsg(null);

    try {
      const ext = file.name.split(".").pop() || "pdf";
      const fileName = `${id}-proposal-${Date.now()}.${ext}`;
      const filePath = `proposals/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from("project-docs")
        .upload(filePath, file, { upsert: true });

      if (upErr) throw upErr;

      const { data } = supabase.storage
        .from("project-docs")
        .getPublicUrl(filePath);

      setProposalPublicUrl(data.publicUrl);
    } catch (e: any) {
      setMsg(e?.message || "Failed to upload PDF.");
    } finally {
      setPdfUploading(false);
    }
  }

  const parsedBudgetBreakdown = useMemo(() => {
    if (!budgetBreakdownText.trim()) return null;
    try {
      return JSON.parse(budgetBreakdownText);
    } catch {
      return "__INVALID_JSON__";
    }
  }, [budgetBreakdownText]);

  async function saveDraft() {
    if (!project) return;

    if (parsedBudgetBreakdown === "__INVALID_JSON__") {
      setMsg("Budget breakdown must be valid JSON.");
      return;
    }

    setSaving(true);
    setMsg(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        goals: goals.trim(),
        stage: stage.trim(),
        budget_ugx: Number(budgetUgx || 0),
        goal_ugx: Number(goalUgx || 0),
        proposal_text: proposalText.trim(),
        budget_breakdown: parsedBudgetBreakdown,
        cover_image_url: coverImageUrl || null,
        proposal_public_url: proposalPublicUrl || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id);

      if (error) throw error;

      setMsg("Draft saved successfully.");
      await load();
    } catch (e: any) {
      setMsg(e?.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function submitForApproval() {
    if (!project) return;

    if (!title.trim() || !description.trim() || !goals.trim()) {
      setMsg("Please complete title, description, and goals before submitting.");
      return;
    }

    if (parsedBudgetBreakdown === "__INVALID_JSON__") {
      setMsg("Budget breakdown must be valid JSON before submitting.");
      return;
    }

    if (!proposalPublicUrl) {
      setMsg("Please upload a proposal PDF before submitting.");
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        goals: goals.trim(),
        stage: stage.trim(),
        budget_ugx: Number(budgetUgx || 0),
        goal_ugx: Number(goalUgx || 0),
        proposal_text: proposalText.trim(),
        budget_breakdown: parsedBudgetBreakdown,
        cover_image_url: coverImageUrl || null,
        proposal_public_url: proposalPublicUrl || null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id);

      if (error) throw error;

      setMsg("Project submitted for approval.");
      await load();
    } catch (e: any) {
      setMsg(e?.message || "Failed to submit project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Project</div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                {loading ? "Loading..." : title || "New Project"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-mutedInk">
                Add proposal and budget, upload a cover image and PDF, then submit for approval.
              </p>
              {project ? (
                <div className="mt-2 text-xs text-mutedInk">
                  Status: {project.status || "draft"} • ID: {project.id}
                </div>
              ) : null}
            </div>

            <Link
              href="/members/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
            >
              ← Back
            </Link>
          </div>

          {msg ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {msg}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="text-sm text-mutedInk">Loading project...</div>
          ) : !project ? (
            <div className="text-sm text-mutedInk">Project not found.</div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-2">
                <FieldLabel>Project title</FieldLabel>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
                  placeholder="Enter your project title"
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Description</FieldLabel>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] w-full rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none"
                  placeholder="Describe your project"
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Goals and objectives</FieldLabel>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="min-h-[120px] w-full rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none"
                  placeholder="List your goals and objectives"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <FieldLabel>Stage</FieldLabel>
                  <input
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
                    placeholder="Planning"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Budget (UGX)</FieldLabel>
                  <input
                    type="number"
                    value={budgetUgx}
                    onChange={(e) => setBudgetUgx(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Funding goal (UGX)</FieldLabel>
                  <input
                    type="number"
                    value={goalUgx}
                    onChange={(e) => setGoalUgx(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <FieldLabel>Proposal text</FieldLabel>
                <textarea
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  className="min-h-[160px] w-full rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none"
                  placeholder="Write the proposal for this project"
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Proposal PDF</FieldLabel>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadProposalPdf(file);
                  }}
                  className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
                {pdfUploading ? (
                  <div className="text-xs text-mutedInk">Uploading PDF...</div>
                ) : null}
                {proposalPublicUrl ? (
                  <a
                    href={proposalPublicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-700 hover:underline"
                  >
                    Open uploaded PDF
                  </a>
                ) : null}
              </div>

              <div className="grid gap-2">
                <FieldLabel>Budget breakdown (JSON)</FieldLabel>
                <textarea
                  value={budgetBreakdownText}
                  onChange={(e) => setBudgetBreakdownText(e.target.value)}
                  className="min-h-[140px] w-full rounded-2xl border border-black/10 bg-white p-4 font-mono text-sm outline-none"
                  placeholder='[{"item":"Seeds","amount":300000},{"item":"Tools","amount":700000}]'
                />
                {parsedBudgetBreakdown === "__INVALID_JSON__" ? (
                  <div className="text-xs text-red-700">Budget breakdown must be valid JSON.</div>
                ) : null}
              </div>

              <div className="grid gap-2">
                <FieldLabel>Cover photo</FieldLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCover(file);
                  }}
                  className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
                {coverUploading ? (
                  <div className="text-xs text-mutedInk">Uploading cover photo...</div>
                ) : null}
                {coverImageUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-black/10">
                    <img
                      src={coverImageUrl}
                      alt="Project cover preview"
                      className="h-52 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={saving || loading}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>

                <button
                  type="button"
                  onClick={submitForApproval}
                  disabled={submitting || loading}
                  className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit for Approval"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold">Quick summary</div>
            <div className="mt-3 grid gap-3">
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Current status</div>
                <div className="mt-1 text-lg font-semibold">{project?.status || "draft"}</div>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Budget</div>
                <div className="mt-1 text-lg font-semibold">UGX {fmtUGX(Number(budgetUgx || 0))}</div>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Goal</div>
                <div className="mt-1 text-lg font-semibold">UGX {fmtUGX(Number(goalUgx || 0))}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold">Tips before submission</div>
            <ul className="mt-3 space-y-2 text-sm text-mutedInk">
              <li>• Make your title clear and specific.</li>
              <li>• Explain how the funding will improve income or community impact.</li>
              <li>• Keep your budget realistic and easy to understand.</li>
              <li>• Add a strong cover photo and proposal PDF for better presentation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}