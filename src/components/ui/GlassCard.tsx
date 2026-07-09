"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: "blue" | "green" | "none";
  strong?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  strong = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-2xl",
        glow === "blue" && "neon-glow-blue",
        glow === "green" && "neon-glow-green",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
