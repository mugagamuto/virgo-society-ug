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
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <Container>
        {/* Top row */}
        <div className="relative h-16 md:h-20 flex items-center">
          {/* Left (desktop nav) */}
          <div className="hidden md:flex items-center gap-4 text-sm flex-1 min-w-0">
            <NavLinks />
          </div>

          {/* Mobile Left: Logo */}
          <div className="md:hidden flex items-center">
            <Link href="/" aria-label="Home" className="inline-flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Center Brand */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="flex flex-col items-center leading-tight">
              <div className="text-[17px] md:text-xl font-extrabold tracking-tight text-ink whitespace-nowrap">
                Virgo Building Society
              </div>
              <div className="text-[11px] md:text-sm text-mutedInk whitespace-nowrap">
                Transparency-first community funding
              </div>
            </Link>
          </div>

          {/* Right CTAs (desktop) */}
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

          {/* Mobile Right: Menu */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 ml-auto bg-white/70"
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
