import Link from "next/link";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
{ href: "/donors", label: "Fund a Project" },
  { href: "/donate", label: "Donate" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-5 text-sm", className)}>
      {navItems.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className="text-mutedInk hover:text-ink transition"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}














