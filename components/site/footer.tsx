import Link from "next/link";
import { Container } from "./container";
import { site } from "@/content/site";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t border-black/10">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-base font-semibold tracking-tight">{site.name}</div>
            <p className="mt-2 text-sm text-mutedInk max-w-sm">{site.tagline}</p>
            <div className="mt-4 flex gap-2">
              <Badge>Training</Badge>
              <Badge variant="outline">Low-interest loans</Badge>
              <Badge>Child support</Badge>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-semibold">Quick links</div>
            <div className="mt-3 grid gap-2 text-mutedInk">
              <Link className="hover:text-ink" href="/about">About</Link>
              <Link className="hover:text-ink" href="/programs">Programs</Link>
              <Link className="hover:text-ink" href="/impact">Impact</Link>
              <Link className="hover:text-ink" href="/donate">Donate</Link>
              <Link className="hover:text-ink" href="/contact">Contact</Link>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-semibold">Contact</div>
            <div className="mt-3 grid gap-2 text-mutedInk">
              <div>{site.address}</div>
              <div>{site.phone}</div>
              <a className="hover:text-ink" href={`mailto:${site.email}`}>{site.email}</a>
            </div>

            <div className="mt-6 text-xs text-mutedInk">
              <Link className="hover:text-ink" href="/legal/privacy">Privacy</Link>
              <span className="mx-2">•</span>
              <Link className="hover:text-ink" href="/legal/terms">Terms</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-mutedInk">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}


