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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/10">
      <Container className="h-20">
        <div className="relative h-20 flex items-center">
          {/* Left: nav (desktop) */}
          <div className="hidden md:flex items-center gap-4 text-sm flex-1 min-w-0">
            <div className="truncate">
              <NavLinks />
            </div>
          </div>

          {/* Center: brand (absolute center on desktop to prevent shift) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="shrink-0">
                <Logo />
              </div>
              <div className="leading-tight text-center">
                <div className="text-lg md:text-xl font-extrabold tracking-tight text-ink whitespace-nowrap">
                  Virgo Building Society
                </div>
                <div className="text-xs md:text-sm text-mutedInk whitespace-nowrap">
                  Transparency-first community funding
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile: brand left */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <div className="leading-tight">
                <div className="text-base font-extrabold tracking-tight text-ink">
                  Virgo Building Society
                </div>
                <div className="text-[11px] text-mutedInk">
                  Transparency-first community funding
                </div>
              </div>
            </Link>
          </div>

          {/* Right: CTAs (desktop) */}
          <div className="hidden md:flex items-center justify-end gap-3 flex-1 min-w-0">
            <Link href="/members/join">
              <Button size="sm" variant="secondary" className="whitespace-nowrap">
                Become a Member
              </Button>
            </Link>
            <Link href="/donors">
              <Button size="sm" className="whitespace-nowrap">Fund a Project</Button>
            </Link>
          </div>

          {/* Mobile: menu button */}
          <button
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 ml-auto"
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
              <Link href="/members/join" onClick={() => setOpen(false)}>
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
