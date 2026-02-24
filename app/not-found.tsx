import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm text-mutedInk">
          The page you’re looking for doesn’t exist. Use the button below to go back home.
        </p>
        <div className="mt-6">
          <Link href="/"><Button>Go home</Button></Link>
        </div>
      </div>
    </Container>
  );
}
