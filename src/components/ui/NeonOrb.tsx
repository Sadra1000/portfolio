"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonOrbProps {
  className?: string;
  color?: "blue" | "green" | "cyan";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  blue: "bg-blue-500/20",
  green: "bg-emerald-500/20",
  cyan: "bg-cyan-500/20",
};

const sizeMap = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
};

export function NeonOrb({ className, color = "blue", size = "md" }: NeonOrbProps) {
  return (
    <motion.div
      className={cn(
        "absolute rounded-full blur-3xl animate-pulse-glow pointer-events-none",
        colorMap[color],
        sizeMap[size],
        className
      )}
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
