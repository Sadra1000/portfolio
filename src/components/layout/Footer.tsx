"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export function Footer() {
  const { dict } = useLanguage();

  return (
    <footer className="border-t border-glass-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} — {dict.footer.rights}
        </p>
        <p className="text-slate-600">{dict.footer.builtWith}</p>
      </div>
    </footer>
  );
}
