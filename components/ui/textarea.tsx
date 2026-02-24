import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none transition placeholder:text-mutedInk/70 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
