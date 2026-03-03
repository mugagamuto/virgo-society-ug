"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { navItems } from "./nav";
import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <header className="sticky top-0 z-[9999] bg-white/90 backdrop-blur border-b border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <Container>
        <div className="h-16 md:h-20 flex items-center gap-3">
          {/* Logo already includes a Link inside — do NOT wrap */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm flex-1 min-w-0">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-mutedInk hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/members/login?tab=signup">
              <Button size="sm" variant="secondary" className="whitespace-nowrap">
                Become a Member
              </Button>
            </Link>
            <Link href="/donors">
              <Button size="sm" className="whitespace-nowrap">
                Fund a Project
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="ml-auto md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 touch-manipulation inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white active:scale-[0.98]"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      <div className={cn("md:hidden border-t border-black/5", open ? "block" : "hidden")}>
        <Container className="py-4">
          <div className="flex flex-col gap-2 text-sm">
            {/* Hardcoded Home (always works) */}
            <button
              type="button"
              onClick={() => go("/")}
              className="text-left py-2 font-semibold text-ink"
            >
              Home
            </button>

            {/* Other links */}
            {navItems
              .filter((x) => x.href !== "/")
              .map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => go(item.href)}
                  className="text-left py-2 text-mutedInk hover:text-ink"
                >
                  {item.label}
                </button>
              ))}

            <div className="grid gap-2 pt-3">
              <button type="button" onClick={() => go("/members/login?tab=signup")}>
                <Button className="w-full" variant="secondary">
                  Become a Member
                </Button>
              </button>
              <button type="button" onClick={() => go("/donors")}>
                <Button className="w-full">Fund a Project</Button>
              </button>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
