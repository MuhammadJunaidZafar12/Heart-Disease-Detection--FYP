"use client";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-accent)] text-white hover:bg-[#d63d3d] focus-visible:ring-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/20",
        secondary:
          "bg-[var(--color-primary)] text-white hover:bg-[#0b5269] focus-visible:ring-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/20",
        outline:
          "border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/10 focus-visible:ring-[var(--color-primary)]",
        ghost:
          "bg-transparent text-[var(--color-muted)] hover:bg-gray-100 focus-visible:ring-gray-300",
        danger:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus-visible:ring-red-400",
        white:
          "bg-white text-[var(--color-muted)] border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300",
      },
      size: {
        sm: "min-h-[36px] px-3 py-1.5 text-xs rounded-lg",
        md: "min-h-[44px] px-5 py-2.5",
        lg: "min-h-[48px] px-6 py-3 text-base rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export default function Button({
  className,
  variant,
  size,
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { buttonVariants };
