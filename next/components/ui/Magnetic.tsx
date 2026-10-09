"use client";

import { motion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

type MagneticProps = {
  children: ReactNode;
  /** Fraction of the pointer offset the element follows. */
  strength?: number;
  className?: string;
};

/** Pulls its child toward a mouse pointer and springs back on leave. Touch input is ignored. */
export function Magnetic({ children, strength = 0.32, className }: MagneticProps) {
  const x = useSpring(0, spring.magnetic);
  const y = useSpring(0, spring.magnetic);

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
