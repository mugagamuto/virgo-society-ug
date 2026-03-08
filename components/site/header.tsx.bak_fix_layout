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
      <Container className="h-20 flex items-center">
        {/* Left: nav (desktop) */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <NavLinks />
        </div>

        {/* Center: brand */}
        <div className="flex flex-1 items-center justify-start md:justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="shrink-0">
              <Logo />
            </div>
            <div className="leading-tight">
              <div className="text-lg md:text-xl font-extrabold tracking-tight text-ink">
                Virgo Building Society
              </div>
              <div className="text-xs md:text-sm text-mutedInk">
                Transparency-first community funding
              </div>
            </div>
          </Link>
        </div>

        {/* Right: CTAs (desktop) */}
        <div className="hidden md:flex items-center justify-end gap-3 flex-1">
          <Link href="/members/join">
            <Button size="sm" variant="secondary">Become a Member</Button>
          </Link>
          <Link href="/donors">
            <Button size="sm">Fund a Project</Button>
          </Link>
        </div>

        {/* Mobile: menu */}
        <button
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 ml-auto"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
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
