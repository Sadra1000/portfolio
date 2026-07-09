"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getFeaturedProjects } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  const { dict } = useLanguage();

  return (
    <AnimatedSection className="max-w-6xl mx-auto px-6 py-20">
      <GlassCard glow="blue" className="p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          <span className="gradient-text">{dict.about.title}</span>
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
          {dict.about.description}
        </p>
      </GlassCard>
    </AnimatedSection>
  );
}

export function FeaturedProjects() {
  const { dict } = useLanguage();
  const featured = getFeaturedProjects();

  if (featured.length === 0) return null;

  return (
    <AnimatedSection className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">{dict.projects.title}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
        </div>
        <Link
          href="/projects"
          className="hidden sm:flex items-center gap-2 text-sm text-neon-cyan hover:text-neon-green transition-colors"
        >
          {dict.projects.viewAll}
          <ArrowRight className="w-4 h-4 rtl-flip" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      <Link
        href="/projects"
        className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm text-neon-cyan"
      >
        {dict.projects.viewAll}
        <ArrowRight className="w-4 h-4 rtl-flip" />
      </Link>
    </AnimatedSection>
  );
}
