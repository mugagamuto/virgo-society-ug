import Link from "next/link";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/loans", label: "Loans" },
  { href: "/members/login", label: "Member Login" },
  { href: "/impact", label: "Impact" },
  { href: "/donors", label: "Fund a Project" },
  { href: "/donate", label: "Donate" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-5 text-sm", className)}>
      {navItems.map((item) => {
        const isMemberLogin = item.href === "/members/login";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isMemberLogin
                ? "rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
                : "text-mutedInk hover:text-ink transition"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}


