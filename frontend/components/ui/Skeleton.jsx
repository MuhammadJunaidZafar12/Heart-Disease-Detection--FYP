import { cn } from "@/lib/utils";

export default function Skeleton({ className }) {
  return (
    <div
      className={cn("rounded-xl skeleton-shimmer", className)}
      aria-hidden="true"
    />
  );
}
