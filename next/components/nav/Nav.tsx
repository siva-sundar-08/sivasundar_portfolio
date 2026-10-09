"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMode } from "@/components/providers/ModeProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { useSound } from "@/components/providers/SoundProvider";
import { sections } from "@/content/site";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

function useActiveSection(enabled: boolean): string {
  const [active, setActive] = useState<string>("hero");
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive((entry.target as HTMLElement).dataset.section ?? "hero");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}

function ProgressRing() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <svg
      viewBox="0 0 40 40"
      className="absolute inset-0 size-full -rotate-90"
      aria-hidden
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="rgb(255 255 255 / 0.12)"
        strokeWidth="1.5"
      />
      <motion.circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

function SoundBars({ on }: { on: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-current"
          animate={on ? { height: ["30%", `${h * 100}%`, "40%"] } : { height: "25%" }}
          transition={
            on
              ? {
                  duration: 0.9 + i * 0.15,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const lenis = useLenis();
  const { mode, toggleMode } = useMode();
  const { enabled: soundOn, toggle: toggleSound } = useSound();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const meta = isHome
    ? (sections.find((s) => s.id === active) ?? sections[0])
    : { label: "Off course" };

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  const scrollTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const control =
    "relative flex h-10 items-center justify-center rounded-full px-3 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-dim transition-colors hover:text-ink";

  return (
    <>
      <a
        href="#main"
        className="glass fixed! top-4 left-4 z-[100] -translate-y-24 px-4 py-2 font-mono text-xs focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: ease.outExpo, delay: 0.2 }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 md:top-6"
      >
        <nav
          aria-label="Primary"
          className="glass flex items-center gap-1 rounded-full p-1.5 [--glass-blur:22px]"
        >
          {isHome ? (
            <button
              type="button"
              onClick={scrollTop}
              aria-label="Back to top"
              className="relative grid size-10 place-items-center rounded-full"
            >
              <ProgressRing />
              <span aria-hidden className="text-sm">
                ↑
              </span>
            </button>
          ) : (
            <Link
              href="/"
              transitionTypes={["nav-back"]}
              aria-label="Home"
              className="relative grid size-10 place-items-center rounded-full"
            >
              <ProgressRing />
              <span aria-hidden className="text-sm">
                ←
              </span>
            </Link>
          )}

          <div
            className="hidden min-w-[9.5rem] overflow-hidden px-3 hud sm:block"
            aria-live="polite"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={meta.label}
                initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: ease.outExpo }}
                className="block whitespace-nowrap"
              >
                <span className="text-accent">●</span> {meta.label}
              </motion.span>
            </AnimatePresence>
          </div>

          <ul className="hidden items-center lg:flex">
            {links.map((link) => {
              const current = isHome && active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={href(link.id)}
                    aria-current={current ? "location" : undefined}
                    className={cn(control, current && "text-ink")}
                  >
                    {current ? (
                      <motion.span
                        layoutId="nav-active"
                        transition={spring.panel}
                        className="absolute inset-0 rounded-full bg-white/[0.07]"
                      />
                    ) : null}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" aria-hidden />

          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            className={cn(control, "gap-2")}
          >
            <SoundBars on={soundOn} />
            <span className="sr-only sm:not-sr-only">Sound</span>
          </button>

          <button
            type="button"
            onClick={toggleMode}
            aria-label={`${mode} mode, switch to ${mode === "void" ? "aurora" : "void"}`}
            className={cn(control, "gap-2")}
          >
            <span
              aria-hidden
              className="size-2.5 rounded-full bg-[conic-gradient(var(--accent),var(--accent-2),var(--accent-3),var(--accent))] shadow-[0_0_12px_var(--accent)]"
            />
            <span>{mode}</span>
          </button>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={cn(control, "lg:hidden")}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0, clipPath: "circle(0% at 50% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 50% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 50% 0%)" }}
            transition={{ duration: 0.7, ease: ease.warp }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-[var(--void-0)]/95 px-8 backdrop-blur-xl lg:hidden"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.id}
                href={href(link.id)}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: ease.outExpo }}
                className="flex items-baseline gap-4 py-2 display-wide text-[clamp(1.5rem,7vw,2.75rem)] uppercase"
              >
                <span className="hud">0{i + 1}</span>
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
