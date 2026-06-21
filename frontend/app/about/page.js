"use client";

import { Heart, Target, Users, Award } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection, { AnimatedItem } from "@/components/ui/AnimatedSection";
import MotionCard from "@/components/ui/MotionCard";

const missionCards = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To make heart disease screening accessible to everyone through AI-powered technology.",
  },
  {
    icon: Users,
    title: "Who We Serve",
    desc: "Healthcare providers and individuals seeking early detection and prevention tools.",
  },
  {
    icon: Award,
    title: "Our Approach",
    desc: "Combining clinical expertise with machine learning for accurate, reliable predictions.",
  },
];

const team = [
  { initials: "JZ", name: "Muhammad Junaid Zafar", role: "MERN Stack Developer" },
  { initials: "MS", name: "Muhammad Sufyan", role: "Frontend Developer" },
  { initials: "AI", name: "AI Research Team", role: "Machine Learning" },
  { initials: "CD", name: "Clinical Advisors", role: "Healthcare Experts" },
];

export default function About() {
  return (
    <div className="bg-[var(--color-surface)] py-12 sm:py-16 md:py-20">
      <div className="page-container">
        <PageHeader
          icon={Heart}
          title="About CardioGuard"
          subtitle="Empowering early heart disease detection through artificial intelligence."
        />

        <AnimatedSection className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {missionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <MotionCard key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <Icon className="text-[var(--color-primary)]" size={28} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-[var(--color-foreground)] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </MotionCard>
              );
            })}
          </div>
        </AnimatedSection>

        <AnimatedItem className="max-w-4xl mx-auto card p-6 sm:p-8 mb-12">
          <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">
            Our Story
          </h3>
          <div className="space-y-4 text-[var(--color-muted)] text-base sm:text-lg leading-relaxed">
            <p>
              CardioGuard was founded by a team of cardiologists and data scientists who recognized the potential of AI to transform heart disease screening.
            </p>
            <p>
              Our journey began with a simple idea: to create a tool that could analyze ECG data and identify early signs of heart disease, making screening more accessible and efficient.
            </p>
            <p>
              After years of research and development, we launched CardioGuard, an AI-powered platform that provides accurate predictions based on ECG data.
            </p>
          </div>
        </AnimatedItem>

        <AnimatedSection>
          <AnimatedItem className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              Meet the Team
            </h3>
          </AnimatedItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <MotionCard key={index} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    {member.initials}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">
                  {member.name}
                </h4>
                <p className="text-[var(--color-muted)]">{member.role}</p>
              </MotionCard>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
