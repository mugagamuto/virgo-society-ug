import { Suspense } from "react";
import MemberAuthClient from "./Client";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <MemberAuthClient />
    </Suspense>
  );
}
