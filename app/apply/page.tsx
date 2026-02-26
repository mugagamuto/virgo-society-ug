// app/apply/page.tsx
import { redirect } from "next/navigation";

export default function ApplyPage() {
  redirect("/members/login?tab=signup");
}