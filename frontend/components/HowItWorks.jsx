"use client";

import { ClipboardList, Cpu, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedItem } from "@/components/ui/AnimatedSection";

export default function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Enter Your Data",
      desc: "Fill in your health parameters like age, blood pressure, cholesterol, and more.",
    },
    {
      icon: Cpu,
      title: "AI Analysis",
      desc: "Our machine learning model processes your data through multiple algorithms.",
    },
    {
      icon: FileCheck,
      title: "Get Results",
      desc: "Receive an instant risk assessment with a detailed breakdown and recommendations.",
    },
  ];

  return (
    <AnimatedSection className="bg-[var(--color-surface)] py-16 sm:py-20 md:py-24">
      <div className="page-container">
        <AnimatedItem className="text-center mb-12 sm:mb-16">
          <h2 className="section-title">
            How It <span className="text-[var(--color-accent)]">Works</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Three simple steps to assess your heart disease risk.
          </p>
        </AnimatedItem>

        <div className="relative max-w-6xl mx-auto">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] origin-left">
            <motion.div
              className="h-full bg-[var(--color-primary)]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimatedItem
                  key={index}
                  className="flex flex-col items-center text-center relative"
                >
                  {index < steps.length - 1 && (
                    <div className="md:hidden absolute left-1/2 top-[5.5rem] bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] -translate-x-1/2 h-[calc(100%-5.5rem)]" />
                  )}

                  <div className="relative mb-6">
                    <div className="w-20 h-20 flex items-center justify-center bg-white shadow-lg shadow-[var(--color-primary)]/10 rounded-2xl border border-gray-100">
                      <Icon className="text-[var(--color-primary)]" size={32} />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-[var(--color-accent)] text-white text-xs w-7 h-7 flex items-center justify-center rounded-full font-bold shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-[var(--color-foreground)]">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-sm max-w-xs leading-relaxed">
                    {step.desc}
                  </p>
                </AnimatedItem>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
