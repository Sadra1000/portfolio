"use client";

import { Hero } from "@/components/landing/Hero";
import { AboutSection, FeaturedProjects } from "@/components/landing/AboutSection";
import { SkillsSection } from "@/components/landing/SkillsSection";
import { ExperienceSection } from "@/components/landing/ExperienceSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <FeaturedProjects />
    </>
  );
}
