"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function MotionCard({
  children,
  className,
  hover = true,
  asItem = true,
}) {
  const Wrapper = asItem ? motion.div : motion.div;

  return (
    <Wrapper
      variants={asItem ? item : undefined}
      whileHover={
        hover
          ? { y: -4, transition: { duration: 0.2 } }
          : undefined
      }
      className={cn(
        "bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-[var(--color-primary)]/5",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/10",
        "group relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5" />
      <div className="relative">{children}</div>
    </Wrapper>
  );
}
