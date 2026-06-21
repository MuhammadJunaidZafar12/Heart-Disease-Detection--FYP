import { cn } from "@/lib/utils";

export function Card({ className, children, gradient = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm shadow-[var(--color-primary)]/5",
        gradient &&
          "relative before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-[var(--color-primary)] before:to-[var(--color-accent)] before:-z-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
}

export function CardBody({ className, children }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}
