"use client";

import { useRef } from "react";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type MorphHeadingProps = {
  children: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

/**
 * A display heading whose variable-font width and weight expand as it
 * scrolls into view. It is one left-aligned text node, so its start
 * position never moves and the morph causes no layout shift.
 */
export function MorphHeading({ children, id, className, as: Tag = "h2" }: MorphHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el,
        {
          fontVariationSettings: "'wdth' 50, 'wght' 200",
          letterSpacing: "0.12em",
          opacity: 0.25,
        },
        {
          fontVariationSettings: "'wdth' 150, 'wght' 800",
          letterSpacing: "-0.02em",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn(
        "display-wide text-[clamp(2.6rem,9.5vw,8.5rem)] whitespace-nowrap uppercase",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
