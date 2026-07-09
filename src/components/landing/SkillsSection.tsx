"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { skills } from "@/data/profile";
import { useLanguage } from "@/i18n/LanguageProvider";

const categoryKeys = ["crossPlatform", "frontend", "backend", "tools"] as const;

const categoryColors: Record<string, string> = {
  crossPlatform: "from-blue-500/20 to-cyan-500/20 border-blue-500/20",
  frontend: "from-cyan-500/20 to-emerald-500/20 border-cyan-500/20",
  backend: "from-emerald-500/20 to-green-500/20 border-emerald-500/20",
  tools: "from-blue-500/20 to-emerald-500/20 border-blue-500/20",
};

export function SkillsSection() {
  const { dict } = useLanguage();

  return (
    <AnimatedSection className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        <span className="gradient-text">{dict.skills.title}</span>
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mb-12" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryKeys.map((key, i) => (
          <GlassCard
            key={key}
            glow={i % 2 === 0 ? "blue" : "green"}
            className={`p-6 bg-gradient-to-br ${categoryColors[key]}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">
              {dict.skills.categories[key]}
            </h3>
            <ul className="space-y-2">
              {skills[key].map((skill) => (
                <li
                  key={skill}
                  className="text-slate-300 text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                  {skill}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </AnimatedSection>
  );
}
