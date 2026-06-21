import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
        accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
        success: "bg-green-100 text-green-700",
        danger: "bg-red-100 text-red-700",
        warning: "bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function Badge({ className, variant, children }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>{children}</span>
  );
}
