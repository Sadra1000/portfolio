"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/i18n/LanguageProvider";

export function ExperienceSection() {
  const { dict } = useLanguage();

  if (dict.experience.items.length === 0) return null;

  return (
    <AnimatedSection className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        <span className="gradient-text">{dict.experience.title}</span>
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mb-12" />

      <div className="relative space-y-8">
        <div className="absolute start-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-transparent hidden sm:block" />

        {dict.experience.items.map((item, i) => (
          <GlassCard
            key={i}
            className="relative p-6 sm:ms-12"
            glow={i % 2 === 0 ? "blue" : "green"}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="absolute -start-3 top-8 w-6 h-6 rounded-full bg-slate-900 border-2 border-neon-cyan hidden sm:block" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 className="text-lg font-semibold text-slate-200">{item.role}</h3>
              <span className="text-sm text-neon-cyan font-mono">{item.period}</span>
            </div>
            <p className="text-sm text-neon-green mb-2">{item.company}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
          </GlassCard>
        ))}
      </div>
    </AnimatedSection>
  );
}
