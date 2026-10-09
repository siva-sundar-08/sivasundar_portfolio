"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Weighted scrolling via Lenis, driven by GSAP's ticker so ScrollTrigger and
 * Lenis share one clock. Skipped entirely for reduced-motion visitors.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      anchors: true,
      autoRaf: false,
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const frame = requestAnimationFrame(() => setLenis(instance));

    return () => {
      cancelAnimationFrame(frame);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname, lenis]);

  return <LenisContext value={lenis}>{children}</LenisContext>;
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
