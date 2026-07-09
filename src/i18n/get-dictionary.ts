import type { Locale } from "./config";
import en from "./messages/en.json";
import fa from "./messages/fa.json";

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

type BaseDictionary = typeof en;

export type Dictionary = Omit<BaseDictionary, "experience"> & {
  experience: {
    title: string;
    items: ExperienceItem[];
  };
};

const dictionaries: Record<Locale, Dictionary> = { en, fa };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
