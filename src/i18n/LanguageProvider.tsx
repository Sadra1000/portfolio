"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type Locale,
  defaultLocale,
  getDirection,
  isValidLocale,
} from "./config";
import { getDictionary, type Dictionary } from "./get-dictionary";

const STORAGE_KEY = "portfolio-locale";

interface LanguageContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidLocale(stored)) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = getDirection(locale);
    html.style.fontFamily =
      locale === "fa"
        ? "var(--font-vazirmatn), system-ui, sans-serif"
        : "";
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "fa" : "en");
  }, [locale, setLocale]);

  const dict = getDictionary(locale);

  return (
    <LanguageContext.Provider value={{ locale, dict, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
