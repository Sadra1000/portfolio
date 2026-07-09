"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { getProjectBySlug } from "@/data/projects";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useLanguage } from "@/i18n/LanguageProvider";

interface ProjectDetailProps {
  slug: string;
}

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const { locale, dict } = useLanguage();
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-neon-cyan transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            {dict.projects.backToProjects}
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">{project.title[locale]}</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            {project.description[locale]}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <ProjectGallery
            images={project.images}
            title={project.title[locale]}
          />
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="mt-12">
          <GlassCard className="p-8 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-3">
                {dict.projects.techStack}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-lg bg-blue-500/10 text-slate-300 border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed">
              {project.longDescription[locale]}
            </p>

            {(project.links.github || project.links.live) && (
              <div>
                <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-3">
                  {dict.projects.links}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-slate-300 hover:text-neon-cyan transition-colors"
                    >
                      <GitHubIcon className="w-4 h-4" />
                      {dict.projects.github}
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-slate-300 hover:text-neon-green transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {dict.projects.liveDemo}
                    </a>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
}
