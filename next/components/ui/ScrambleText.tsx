"use client";

import { useRef } from "react";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>[]{}";
const WINDOW = 28;

type ScrambleTextProps = {
  text: string;
  as?: "p" | "span" | "div";
  className?: string;
  /** ScrollTrigger start/end; progress across this range resolves the text. */
  start?: string;
  end?: string;
  /** Element whose scroll position drives the effect (defaults to the text itself). */
  trigger?: string;
};

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Text that resolves from glyph noise into clear type as it scrolls through
 * the viewport. Each glyph overlays its real character, so layout never
 * moves, and screen readers get the plain text.
 */
export function ScrambleText({
  text,
  as: Tag = "p",
  className,
  start = "top 85%",
  end = "top 30%",
  trigger,
}: ScrambleTextProps) {
  const root = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      registerGsap();
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const chars = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-c]"));
      const total = chars.length;
      let progress = 0;
      let lastShuffle = 0;

      const render = (time: number) => {
        const resolved = Math.floor(progress * total * 1.1);
        const shuffle = time - lastShuffle > 0.06;
        if (shuffle) lastShuffle = time;
        for (let i = 0; i < total; i++) {
          const char = chars[i];
          if (i < resolved) {
            if (char.dataset.g) char.dataset.g = "";
          } else if (i < resolved + WINDOW) {
            if (shuffle || !char.dataset.g) char.dataset.g = randomGlyph();
          } else if (!char.dataset.g) {
            char.dataset.g = randomGlyph();
          }
        }
      };

      render(0);
      const tick = (time: number) => render(time);
      const st = ScrollTrigger.create({
        trigger: trigger ?? el,
        start,
        end,
        onUpdate: (self) => {
          progress = self.progress;
        },
        onToggle: (self) => {
          if (self.isActive) gsap.ticker.add(tick);
          else {
            gsap.ticker.remove(tick);
            render(Number.MAX_SAFE_INTEGER);
          }
        },
      });
      progress = st.progress;
      render(0);

      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [text, start, end, trigger] },
  );

  return (
    <Tag className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span ref={root} aria-hidden>
        {words.map((word, w) => (
          <span key={w}>
            <span className="whitespace-nowrap">
              {word.split("").map((char, c) => (
                <span key={c} data-c className="scramble-char">
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
