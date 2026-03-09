"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

export default function NewProjectPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Preparing your new project...");

  useEffect(() => {
    let active = true;

    async function createDraft() {
      try {
        const { data: authData, error: authErr } = await supabase.auth.getUser();
        if (authErr) throw authErr;

        const user = authData?.user;
        if (!user) {
          router.replace("/members/login?tab=login");
          return;
        }

        const { data: member } = await supabase
          .from("members")
          .select("org_name,district,email,members_count,location")
          .eq("user_id", user.id)
          .maybeSingle();

        const payload = {
          owner_id: user.id,
          owner_email: user.email ?? member?.email ?? null,
          org_name: member?.org_name ?? null,
          members_count: member?.members_count ?? null,
          location: member?.location ?? null,
          district: member?.district ?? null,
          title: "New Project Draft",
          description: "This draft project is being created so the member can continue editing the proposal, budget, cover photo, and supporting details before submitting it for admin approval and donor review.",
          goals: "The goals of this draft project will be refined by the member to clearly explain the expected impact, funding need, implementation steps, and community or income improvement outcomes before submission.",
          stage: "Planning",
          budget_ugx: 0,
          goal_ugx: 0,
          funded_ugx: 0,
          amount_raised_ugx: 0,
          status: "draft",
          is_fundable: false,
          proposal_text: "",
          budget_breakdown: null,
          proposal_public_url: null,
          cover_image_url: null,
        };

        const { data, error } = await supabase
          .from("projects")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;
        if (!data?.id) throw new Error("Project draft was created but no id was returned.");

        if (active) {
          router.replace(`/members/projects/${data.id}`);
        }
      } catch (e: any) {
        if (active) {
          setMsg(e?.message || "Failed to create a new project.");
        }
      }
    }

    createDraft();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Create New Project</h1>
        <p className="mt-3 text-sm text-mutedInk">{msg}</p>

        <div className="mt-6">
          <Link
            href="/members/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


