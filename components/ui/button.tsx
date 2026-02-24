import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const styles = {
  base:
    "inline-flex items-center justify-center rounded-2xl font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  variant: {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 shadow-soft",
    secondary:
      "bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-100",
    ghost:
      "bg-transparent hover:bg-black/5 border border-black/10"
  },
  size: {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base"
  }
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(styles.base, styles.variant[variant], styles.size[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


