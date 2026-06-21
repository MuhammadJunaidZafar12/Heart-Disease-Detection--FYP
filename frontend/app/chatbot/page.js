"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function Chatbot() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-surface)] px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center"
        >
          <MessageCircle className="w-10 h-10 text-[var(--color-primary)]" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4">
          Chatbot
        </h1>
        <p className="text-[var(--color-muted)] text-lg leading-relaxed">
          working on it...Come back later! comming soon!
        </p>
      </motion.div>
    </div>
  );
}
