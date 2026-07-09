"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { NeonOrb } from "@/components/ui/NeonOrb";
import { GlassCard } from "@/components/ui/GlassCard";
import { projects } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function ProjectsPage() {
  const { dict } = useLanguage();

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-6 overflow-hidden">
      <NeonOrb color="blue" size="lg" className="-top-20 start-0" />
      <NeonOrb color="green" size="md" className="bottom-0 end-0" />

      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">{dict.projects.title}</span>
          </h1>
          <p className="text-slate-400 text-lg mb-12">{dict.projects.subtitle}</p>
        </AnimatedSection>

        {projects.length === 0 ? (
          <AnimatedSection delay={0.1}>
            <GlassCard glow="blue" className="p-12 text-center">
              <p className="text-slate-400 text-lg">{dict.projects.empty}</p>
            </GlassCard>
          </AnimatedSection>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
