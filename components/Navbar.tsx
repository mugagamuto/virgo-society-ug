"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/members/login", label: "Member Login" },
  { href: "/members/signup", label: "Member Sign Up" },
  { href: "/admin/login", label: "Admin Login" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Virgo Building Society
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "rounded-xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-neutral-700 hover:bg-neutral-100",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-xl border px-3 py-2 text-sm">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border bg-white shadow-lg">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
