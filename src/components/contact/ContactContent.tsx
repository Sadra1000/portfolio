"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Copy, Check } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { NeonOrb } from "@/components/ui/NeonOrb";
import { profile } from "@/data/profile";
import { useLanguage } from "@/i18n/LanguageProvider";

const contactLinks = [
  {
    key: "email" as const,
    icon: Mail,
    href: `mailto:${profile.email}`,
    value: profile.email,
    color: "blue" as const,
  },
  {
    key: "telegram" as const,
    icon: Send,
    href: `https://t.me/${profile.telegram.replace("@", "")}`,
    value: profile.telegram,
    color: "cyan" as const,
  },
  {
    key: "github" as const,
    icon: GitHubIcon,
    href: profile.github,
    value: profile.github.replace("https://github.com/", ""),
    color: "green" as const,
  },
];

export function ContactContent() {
  const { dict } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-6 overflow-hidden">
      <NeonOrb color="blue" size="lg" className="-top-10 end-0" />
      <NeonOrb color="green" size="md" className="bottom-0 -start-20" />

      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">{dict.contact.title}</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              {dict.contact.subtitle}
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full glass text-sm text-neon-green"
            >
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              {dict.contact.availability}
            </motion.div>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {contactLinks.map((link, i) => (
            <AnimatedSection key={link.key} delay={i * 0.1}>
              <GlassCard
                glow={link.color === "green" ? "green" : "blue"}
                className="p-5 flex items-center gap-4 group"
                whileHover={{ x: 4 }}
              >
                <div className="p-3 rounded-xl bg-blue-500/10 text-neon-cyan shrink-0">
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    {dict.contact[link.key]}
                  </p>
                  <a
                    href={link.href}
                    target={link.key !== "email" ? "_blank" : undefined}
                    rel={link.key !== "email" ? "noopener noreferrer" : undefined}
                    className="text-slate-200 hover:text-neon-cyan transition-colors truncate block"
                  >
                    {link.value}
                  </a>
                </div>
                {link.key === "email" && (
                  <button
                    onClick={copyEmail}
                    className="p-2 rounded-lg glass text-slate-400 hover:text-neon-green transition-colors shrink-0"
                    aria-label={dict.contact.copyEmail}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-neon-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>

        {copied && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-neon-green mt-4"
          >
            {dict.contact.copied}
          </motion.p>
        )}
      </div>
    </section>
  );
}
