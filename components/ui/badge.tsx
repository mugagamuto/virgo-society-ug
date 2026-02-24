import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "soft",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "soft" | "outline" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "soft" && "bg-brand-50 text-brand-800 border border-brand-100",
        variant === "outline" && "border border-black/10 text-ink",
        className
      )}
      {...props}
    />
  );
}


