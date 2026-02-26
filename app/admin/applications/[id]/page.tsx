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
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-black/5">
      <Container className="h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          <Link href="/donors">
            <Button size="sm">Fund a Project</Button>
          </Link>
        </div>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

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
            <Link href="/donors" onClick={() => setOpen(false)}>
              <Button className="w-full mt-2">Fund a Project</Button>
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}




