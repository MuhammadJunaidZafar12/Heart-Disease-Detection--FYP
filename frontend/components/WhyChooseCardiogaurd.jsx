"use client";

import {
  Brain,
  ShieldCheck,
  Zap,
  BarChart3,
  MessageCircle,
  Clock,
} from "lucide-react";
import AnimatedSection, { AnimatedItem } from "@/components/ui/AnimatedSection";
import MotionCard from "@/components/ui/MotionCard";

export default function WhyChooseCardiogaurd() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      desc: "Advanced machine learning models trained on thousands of clinical records.",
    },
    {
      icon: ShieldCheck,
      title: "Clinically Validated",
      desc: "Our models are validated against real-world clinical outcomes.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      desc: "Get your heart disease risk assessment in seconds, not days.",
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      desc: "Comprehensive risk breakdowns with actionable health insights.",
    },
    {
      icon: MessageCircle,
      title: "AI Chatbot",
      desc: "Ask our AI assistant any heart health questions anytime.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      desc: "Access your health predictions around the clock from anywhere.",
    },
  ];

  return (
    <AnimatedSection className="bg-white py-16 sm:py-20 md:py-24">
      <div className="page-container">
        <AnimatedItem className="text-center mb-12 sm:mb-16">
          <h2 className="section-title">
            Why Choose{" "}
            <span className="text-[var(--color-primary)]">CardioGuard?</span>
          </h2>
          <p className="section-subtitle mx-auto">
            State-of-the-art technology meets medical expertise for reliable
            heart disease detection.
          </p>
        </AnimatedItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <MotionCard key={index}>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-primary)]/10 mb-4 transition-colors duration-300 group-hover:bg-[var(--color-accent)]">
                  <Icon
                    size={24}
                    className="text-[var(--color-primary)] transition-colors duration-300 group-hover:text-white"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[var(--color-foreground)]">
                  {item.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </MotionCard>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
