import { assetPath } from "@/lib/paths";

export const profile = {
  name: {
    en: "Mohammad Sadra Soltani",
    fa: "محمد صدرا سلطانی",
  },
  email: "soltani.flutter.dev@gmail.com",
  telegram: "@flut_dev",
  github: "https://github.com/Sadra1000",
  avatar: assetPath("/images/avatar.png"),
} as const;

export const skills = {
  crossPlatform: [
    "Flutter",
    "Dart",
    "Android",
    "iOS",
    "Windows",
    "macOS",
    "Web",
  ],
  frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  backend: ["FastAPI", "Python", "AI API Engineering", "REST APIs"],
  tools: ["Git", "Docker", "GitHub Actions", "CI/CD"],
} as const;
