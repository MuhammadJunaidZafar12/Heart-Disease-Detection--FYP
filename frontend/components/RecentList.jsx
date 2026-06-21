"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function RecentList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("http://localhost:5000/recent-predictions");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching recent predictions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const statusVariant = (status) => {
    if (status === "High") return "danger";
    if (status === "Low") return "success";
    return "warning";
  };

  return (
    <div className="card p-5 sm:p-6 h-full">
      <h3 className="font-semibold text-[var(--color-foreground)] mb-4">
        Recent Predictions
      </h3>

      <div className="space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] py-8 text-center">
            No recent data
          </p>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex justify-between items-center gap-3 border border-gray-100 p-3 rounded-xl hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 text-xs font-bold text-[var(--color-primary)]">
                  {(item.name || "?")[0]}
                </div>
                <p className="text-sm truncate">
                  <span className="font-medium text-[var(--color-foreground)]">
                    {item.name}
                  </span>{" "}
                  <span className="text-[var(--color-muted)]">Age {item.age}</span>
                </p>
              </div>
              <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
