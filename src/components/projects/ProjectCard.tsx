"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { locale } = useLanguage();

  return (
    <Link href={`/projects/${project.slug}`}>
      <GlassCard
        className="group relative overflow-hidden h-full"
        glow="blue"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.images[0]}
            alt={project.title[locale]}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          <motion.div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-blue-500/20 text-neon-cyan border border-blue-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-300 line-clamp-2">
              {project.description[locale]}
            </p>
          </motion.div>
        </div>

        <div className="p-5 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 group-hover:text-neon-cyan transition-colors">
            {project.title[locale]}
          </h3>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-neon-green transition-colors shrink-0" />
        </div>
      </GlassCard>
    </Link>
  );
}
