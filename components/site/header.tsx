"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { NavLinks, navItems } from "./nav";
import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <Container>
        <div className="relative h-16 md:h-20 flex items-center">
          {/* Desktop left nav */}
          <div className="hidden md:flex items-center gap-5 text-sm flex-1 min-w-0">
            <NavLinks />
          </div>

          {/* Mobile left: logo */}
          <div className="md:hidden flex items-center">
            <Logo />
          </div>

          {/* Brand centered (all sizes) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center">
            <Link href="/" className="flex flex-col items-center">
              <div className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold tracking-tight text-ink leading-[1.15]">
                Virgo Building Society
              </div>
              <div className="mt-0.5 hidden sm:block text-[11px] md:text-[13px] text-mutedInk leading-[1.2]">
                Transparency-first community funding
              </div>
            </Link>
          </div>

          {/* Desktop right CTAs */}
          <div className="hidden md:flex items-center justify-end gap-3 flex-1">
            <Link href="/members/login?tab=signup">
              <Button size="sm" variant="secondary" className="whitespace-nowrap">
                Become a Member
              </Button>
            </Link>
            <Link href="/donors">
              <Button size="sm" className="whitespace-nowrap">Fund a Project</Button>
            </Link>
          </div>

          {/* Mobile menu button (right) */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 ml-auto bg-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      <div className={cn("md:hidden border-t border-black/5", open ? "block" : "hidden")}>
        <Container className="py-4">
          <div className="flex flex-col gap-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-mutedInk hover:text-ink"
              >
                {item.label}
              </Link>
            ))}

            <div className="grid gap-2 pt-2">
              <Link href="/members/login?tab=signup" onClick={() => setOpen(false)}>
                <Button className="w-full" variant="secondary">Become a Member</Button>
              </Link>
              <Link href="/donors" onClick={() => setOpen(false)}>
                <Button className="w-full">Fund a Project</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
