"use client";

import { Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 sm:p-12 text-center max-w-lg mx-auto"
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
        <Settings className="w-8 h-8 text-[var(--color-primary)]" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
        Settings
      </h2>
      <p className="text-[var(--color-muted)]">settings page</p>
    </motion.div>
  );
}
