import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const placeholders = [
  { file: "ecommerce-1.svg", label: "E-Commerce #1", color: "#3b82f6" },
  { file: "ecommerce-2.svg", label: "E-Commerce #2", color: "#22d3ee" },
  { file: "ecommerce-3.svg", label: "E-Commerce #3", color: "#10b981" },
  { file: "dashboard-1.svg", label: "Dashboard #1", color: "#3b82f6" },
  { file: "dashboard-2.svg", label: "Dashboard #2", color: "#34d399" },
  { file: "api-1.svg", label: "API #1", color: "#22d3ee" },
  { file: "api-2.svg", label: "API #2", color: "#10b981" },
  { file: "portfolio-1.svg", label: "Portfolio", color: "#3b82f6" },
];

const dir = join(process.cwd(), "public", "images", "projects");
mkdirSync(dir, { recursive: true });

for (const { file, label, color } of placeholders) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <rect width="800" height="450" fill="#0f172a"/>
  <rect x="40" y="40" width="720" height="370" rx="16" fill="#1e293b" stroke="${color}" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="400" cy="200" r="40" fill="${color}" fill-opacity="0.2"/>
  <text x="400" y="300" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="18">${label}</text>
  <text x="400" y="330" text-anchor="middle" fill="#475569" font-family="sans-serif" font-size="12">Replace with actual screenshot</text>
</svg>`;
  writeFileSync(join(dir, file), svg);
}

console.log("Placeholder images created.");
