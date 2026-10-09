"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";
import { ease, spring } from "@/lib/motion";

type CursorState =
  | { kind: "dot" }
  | { kind: "ring" }
  | { kind: "label"; label: string }
  | { kind: "text" }
  | { kind: "hidden" };

const INTERACTIVE = "[data-cursor], a, button, [role='button'], label, select";

/**
 * Morphing cursor: dot → ring over interactive elements → labelled pill
 * over anything with `data-cursor="Label"`. Fine pointers only.
 */
export function Cursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, spring.cursor);
  const ringY = useSpring(y, spring.cursor);
  const [state, setState] = useState<CursorState>({ kind: "hidden" });

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea")) return setState({ kind: "text" });
      const interactive = target?.closest<HTMLElement>(INTERACTIVE);
      if (!interactive) return setState({ kind: "dot" });
      const label = interactive.dataset.cursor;
      setState(label ? { kind: "label", label } : { kind: "ring" });
    };

    const onLeave = () => setState({ kind: "hidden" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size =
    state.kind === "ring" ? 46 : state.kind === "label" ? 92 : state.kind === "dot" ? 10 : 0;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border-solid border-white mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: state.kind === "label" ? 92 : size,
          backgroundColor: state.kind === "dot" || state.kind === "label" ? "#fff" : "rgba(255,255,255,0)",
          borderWidth: state.kind === "ring" ? 1 : 0,
          opacity: state.kind === "hidden" || state.kind === "text" ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: ease.outExpo }}
      >
        <AnimatePresence>
          {state.kind === "label" ? (
            <motion.span
              key={state.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: ease.outExpo }}
              className="font-mono text-[10px] tracking-[0.2em] text-black uppercase"
            >
              {state.label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 size-1 rounded-full bg-[var(--accent)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: state.kind === "hidden" || state.kind === "text" ? 0 : 1 }}
      />
    </div>
  );
}
