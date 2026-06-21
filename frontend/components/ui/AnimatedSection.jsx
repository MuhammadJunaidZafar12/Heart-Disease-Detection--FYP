"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AnimatedSection({
  children,
  className,
  as = "section",
  stagger = true,
}) {
  const Component = motion[as] || motion.section;

  return (
    <Component
      variants={stagger ? container : undefined}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(className)}
    >
      {stagger
        ? children
        : children}
    </Component>
  );
}

export function AnimatedItem({ children, className }) {
  return (
    <motion.div variants={item} className={cn(className)}>
      {children}
    </motion.div>
  );
}
