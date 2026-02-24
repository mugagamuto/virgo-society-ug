import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <Image src="/brand/virgo-mark.svg" alt="Virgo" width={34} height={34} priority />
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">Virgo</div>
        <div className="text-xs text-mutedInk -mt-0.5">Building Society</div>
      </div>
    </Link>
  );
}



