import Link from "next/link";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/loans", label: "Loans" },
  { href: "/impact", label: "Impact" },
  { href: "/donate", label: "Donate" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-5 text-sm", className)}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className="text-mutedInk hover:text-ink transition">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
