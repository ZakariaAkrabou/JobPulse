"use client";

import React from "react";
import { motion } from "framer-motion";

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  yOffset = 18,
  className = "",
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
