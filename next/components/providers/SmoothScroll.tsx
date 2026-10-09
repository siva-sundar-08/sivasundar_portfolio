"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

  // Start each new route at the top. The first render keeps whatever
  // position the browser restored or the visitor has already scrolled to.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (window.location.hash) return;
    const toTop = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };
    toTop();
    // The outgoing page's pins unwind during the view transition and can
    // nudge the position, so settle once more after the new page paints.
    const timeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
      toTop();
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [pathname, lenis]);

  // Pinned sections add scroll distance only after ScrollTrigger measures,
  // so the browser's own jump to a #hash lands short. Re-align afterwards.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const timeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const target = document.getElementById(id);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else target.scrollIntoView();
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [pathname, lenis]);

  return <LenisContext value={lenis}>{children}</LenisContext>;
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
