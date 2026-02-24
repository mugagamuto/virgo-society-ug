import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-mutedInk/70 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


