"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 mesh-hero relative items-center justify-center p-12">
        <div
          className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-[var(--color-accent)]/20 blur-3xl animate-float"
          aria-hidden
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-[var(--color-primary)]/30 blur-3xl animate-float-delayed"
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center text-white max-w-md"
        >
          <Heart className="h-16 w-16 mx-auto mb-6 fill-white text-white heartbeat" />
          <h1 className="text-3xl font-bold mb-4">CardioGuard</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            AI-powered heart disease detection for early prevention and better
            outcomes.
          </p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[var(--color-surface)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Heart className="h-8 w-8 text-[var(--color-accent)] fill-[var(--color-accent)]" />
            <span className="font-bold text-xl">CardioGuard</span>
          </Link>

          <div className="card p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[var(--color-muted)] mt-2">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
