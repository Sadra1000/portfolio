"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/AnimatedSection";
import { NeuralNetworkBackground } from "@/components/landing/NeuralNetworkBackground";
import { useLanguage } from "@/i18n/LanguageProvider";
import { profile } from "@/data/profile";

export function Hero() {
  const { dict } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <NeuralNetworkBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6 order-2 lg:order-1">
          <FadeIn>
            <p className="text-neon-cyan font-mono text-sm tracking-wider uppercase">
              {dict.hero.greeting}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">{dict.hero.name}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium">
              {dict.hero.role}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
              {dict.hero.subtitle}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:from-blue-500 hover:to-cyan-500 transition-all neon-glow-blue"
              >
                {dict.hero.ctaProjects}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl-flip" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-slate-300 font-medium hover:text-white hover:border-blue-500/30 transition-all"
              >
                {dict.hero.ctaContact}
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="order-1 lg:order-2 flex justify-center">
          <motion.div
            className="relative"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-emerald-500/20 blur-2xl" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden glass-strong neon-glow-blue border border-blue-500/20">
              <Image
                src={profile.avatar}
                alt={dict.hero.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 256px, 320px"
                priority
              />
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
