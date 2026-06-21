"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  className,
  iconClassName,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("text-center mb-8 sm:mb-10", className)}
    >
      {Icon && (
        <div className="flex justify-center mb-4">
          <div
            className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-[var(--color-accent)]/10",
              iconClassName
            )}
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-accent)]" />
          </div>
        </div>
      )}
      <h1 className="section-title">{title}</h1>
      {subtitle && (
        <p className="section-subtitle mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}
