import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <img
        src="/brand/virgo-logo.svg"
        alt="Virgo Building Society"
        className="h-10 w-auto"
        loading="eager"
      />
    </Link>
  );
}
