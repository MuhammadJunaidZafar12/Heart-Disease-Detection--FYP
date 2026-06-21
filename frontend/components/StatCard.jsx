"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

function AnimatedValue({ value }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => {
    const str = String(value ?? "");
    if (str.includes("%")) {
      return `${Math.round(v)}%`;
    }
    return Number.isFinite(v) ? Math.round(v).toLocaleString() : str;
  });

  useEffect(() => {
    const num = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    spring.set(Number.isFinite(num) ? num : 0);
  }, [value, spring]);

  if (typeof value === "string" && value.includes("%")) {
    return <motion.span>{display}</motion.span>;
  }
  if (typeof value === "number" || !isNaN(parseFloat(value))) {
    return <motion.span>{display}</motion.span>;
  }
  return <span>{value ?? "—"}</span>;
}

export default function StatCard({ title, value, change, icon: Icon }) {
  const hasChange = change !== undefined && change !== null;
  const numericChange = Number(change);
  const isPositive = hasChange ? numericChange >= 0 : true;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[var(--color-muted)] text-sm font-medium">{title}</p>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mt-2">
        <AnimatedValue value={value} />
      </h2>

      {hasChange ? (
        <p
          className={cn(
            "text-sm mt-2 flex items-center gap-1",
            isPositive ? "text-green-600" : "text-red-500"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {Number.isFinite(numericChange)
            ? `${numericChange >= 0 ? `+${numericChange}` : numericChange}%`
            : change}{" "}
          from last month
        </p>
      ) : null}
    </motion.div>
  );
}
