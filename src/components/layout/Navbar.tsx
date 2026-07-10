"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/paths";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Locale } from "@/i18n/config";

export function Navbar() {
  const pathname = usePathname();
  const { locale, dict, toggleLocale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const otherLocale: Locale = locale === "en" ? "fa" : "en";

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/projects", label: dict.nav.projects },
    { href: "/contact", label: dict.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="glass-strong mx-4 mt-4 rounded-2xl px-6 py-3 max-w-6xl lg:mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center shrink-0 rounded-lg transition-opacity hover:opacity-90"
            aria-label={dict.meta.title}
          >
            <Image
              src={assetPath("/images/logo.png")}
              alt=""
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                  isActive(link.href)
                    ? "text-neon-cyan"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-xl bg-blue-500/10 border border-blue-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}

            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 rounded-xl transition-colors ms-2"
              aria-label={dict.nav.language}
            >
              <Globe className="w-4 h-4" />
              {otherLocale === "en" ? "EN" : "فا"}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-4 pb-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                      isActive(link.href)
                        ? "text-neon-cyan bg-blue-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    toggleLocale();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-400 hover:text-slate-200"
                >
                  <Globe className="w-4 h-4" />
                  {otherLocale === "en" ? "English" : "فارسی"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
