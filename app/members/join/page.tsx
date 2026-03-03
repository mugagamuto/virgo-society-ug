import { redirect } from "next/navigation";

export default function MembersJoinRedirect() {
  redirect("/members/login?tab=signup");
}
