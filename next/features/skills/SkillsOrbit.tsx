"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { skillGroups } from "@/content/skills";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/hooks";
import { ease } from "@/lib/motion";

type Node = { skill: string; group: string; ring: number; phase: number };

const nodeClass =
  "glass absolute! top-1/2 left-1/2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] whitespace-nowrap uppercase transition-[color,filter] duration-300 [--glass-blur:8px] md:text-xs";

const RINGS = [
  { radius: 0.36, speed: 0.22 },
  { radius: 0.62, speed: -0.14 },
  { radius: 0.88, speed: 0.09 },
];
const TILT = 1.08; // radians from face-on: how far the orbital plane leans back
const PERSPECTIVE = 2.4;
/** Narrow screens pull the orbits in and shrink labels so nothing spills off-screen. */
const COMPACT_REACH = 0.78;

/**
 * Skills as an orbital system projected in real 3D. DOM buttons (not
 * WebGL) so every node is focusable, readable and keyboard-operable.
 * Drag to spin; hover or focus a node to freeze the system and read it.
 */
export function SkillsOrbit() {
  const stage = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLElement | null>>([]);
  const [selected, setSelected] = useState<Node | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const frozen = useRef(false);
  const compact = useMediaQuery("(max-width: 640px)");
  // On touch screens the orbit is decorative; the legend list carries the content.
  const touch = useMediaQuery("(pointer: coarse)");
  const compactRef = useRef(compact);
  const spin = useRef({ offset: 0, velocity: 0, dragging: false, lastX: 0 });

  const nodes = useMemo<Node[]>(
    () =>
      skillGroups.flatMap((group, ring) =>
        group.skills.map((skill, i) => ({
          skill,
          group: group.id,
          ring,
          phase: (i / group.skills.length) * Math.PI * 2 + ring * 0.7,
        })),
      ),
    [],
  );

  useEffect(() => {
    frozen.current = selected !== null;
  }, [selected]);

  useEffect(() => {
    compactRef.current = compact;
  }, [compact]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let visible = true;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    // Only animate while the orbit is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    observer.observe(el);

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = spin.current;
      if (!frozen.current && !reduced) time += dt;
      if (!s.dragging) {
        s.offset += s.velocity * dt;
        s.velocity *= Math.exp(-2.4 * dt);
      }

      const size = (el?.clientWidth ?? 0) / 2;
      const reach = compactRef.current ? COMPACT_REACH : 1;
      const shrink = compactRef.current ? 0.72 : 1;
      nodes.forEach((node, i) => {
        const button = nodeRefs.current[i];
        if (!button) return;
        const ring = RINGS[node.ring];
        const angle = node.phase + time * ring.speed + s.offset;
        const x = Math.cos(angle) * ring.radius * reach;
        const z = Math.sin(angle) * ring.radius * reach;
        const y = -z * Math.cos(TILT);
        const depth = (z / reach) * Math.sin(TILT);
        const scale = PERSPECTIVE / (PERSPECTIVE - depth);
        button.style.transform = `translate3d(${x * size}px, ${y * size}px, 0) translate(-50%, -50%) scale(${scale * shrink})`;
        button.style.zIndex = String(Math.round(100 + depth * 100));
        button.style.opacity = String(0.35 + ((depth + 1) / 2) * 0.65);
      });

      if (visible) raf = requestAnimationFrame(frame);
      else running = false;
    }
    start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [nodes]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("button")) return;
    spin.current.dragging = true;
    spin.current.lastX = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const s = spin.current;
    if (!s.dragging) return;
    const dx = event.clientX - s.lastX;
    s.lastX = event.clientX;
    s.offset += dx * 0.008;
    s.velocity = dx * 0.5;
  };
  const onPointerUp = () => {
    spin.current.dragging = false;
  };

  const group = skillGroups.find((g) => g.id === (selected?.group ?? activeGroup));

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-cursor="Drag"
        className="relative mx-auto aspect-[5/4] w-full max-w-[640px] touch-pan-y select-none sm:aspect-square"
      >
        <svg
          aria-hidden
          viewBox="-1 -1 2 2"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <g transform={compact ? `scale(${COMPACT_REACH})` : undefined}>
            {RINGS.map((ring, i) => (
              <ellipse
                key={ring.radius}
                cx="0"
                cy="0"
                rx={ring.radius}
                ry={ring.radius * Math.cos(TILT)}
                fill="none"
                stroke={
                  activeGroup === skillGroups[i].id || selected?.ring === i
                    ? "var(--accent)"
                    : "rgb(255 255 255 / 0.14)"
                }
                strokeWidth="0.003"
                strokeDasharray={i === 1 ? "0.01 0.012" : undefined}
                style={{ transition: "stroke 400ms" }}
              />
            ))}
          </g>
        </svg>

        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 grid size-[22%] -translate-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,var(--accent)_25%,var(--accent-2)_60%,transparent_72%)] shadow-[0_0_80px_10px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
        >
          <span className="font-display text-[clamp(0.8rem,2vw,1.2rem)] font-black text-[var(--void-0)] [font-stretch:150%]">
            SS
          </span>
        </div>

        <ul
          aria-label={touch ? undefined : "Skills"}
          aria-hidden={touch || undefined}
          className="absolute inset-0"
        >
          {nodes.map((node, i) => {
            const isSelected = selected?.skill === node.skill;
            const dim = activeGroup !== null && activeGroup !== node.group;
            return (
              <li key={node.skill}>
                {touch ? (
                  <span
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    className={cn(nodeClass, dim && "brightness-50")}
                    style={{ transform: "translate(-50%, -50%)" }}
                  >
                    {node.skill}
                  </span>
                ) : (
                  <button
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    type="button"
                    aria-describedby="skill-detail"
                    onPointerEnter={() => setSelected(node)}
                    onPointerLeave={() => setSelected(null)}
                    onFocus={() => setSelected(node)}
                    onBlur={() => setSelected(null)}
                    className={cn(
                      nodeClass,
                      isSelected && "text-[var(--void-0)] [--glass-fill:var(--accent)]",
                      dim && "brightness-50",
                    )}
                    style={{ transform: "translate(-50%, -50%)" }}
                  >
                    {node.skill}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <div id="skill-detail" aria-live="polite" className="glass min-h-44 p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected?.skill ?? group?.id ?? "idle"}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: ease.outExpo }}
            >
              {selected ? (
                <>
                  <p className="hud">
                    <span className="text-accent">NODE</span> · {group?.title}
                  </p>
                  <p className="mt-3 display-wide text-3xl uppercase">{selected.skill}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                    {group?.summary}
                  </p>
                </>
              ) : group ? (
                <>
                  <p className="hud">
                    <span className="text-accent">ORBIT</span> · {group.skills.length}{" "}
                    nodes
                  </p>
                  <p className="mt-3 display-wide text-3xl uppercase">{group.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                    {group.summary}
                  </p>
                </>
              ) : (
                <>
                  <p className="hud">Idle</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                    {touch
                      ? "Tap an orbit below to light it up. Drag the system to spin it."
                      : "Hover or focus a node to inspect it. Drag the system to spin it."}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <ul className="grid gap-2" aria-label="Skill orbits">
          {skillGroups.map((g, i) => (
            <li key={g.id}>
              <button
                type="button"
                aria-pressed={activeGroup === g.id}
                onClick={() =>
                  setActiveGroup((current) => (current === g.id ? null : g.id))
                }
                className={cn(
                  "flex w-full flex-col items-start gap-2 rounded-2xl border border-white/10 px-5 py-4 text-left transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between",
                  activeGroup === g.id
                    ? "border-[var(--accent)] bg-white/[0.05]"
                    : "hover:bg-white/[0.03]",
                )}
              >
                <span className="flex items-center gap-4">
                  <span className="hud text-accent">0{i + 1}</span>
                  <span className="font-display text-lg font-bold uppercase [font-stretch:125%]">
                    {g.title}
                  </span>
                </span>
                <span className="hud sm:text-right">{g.skills.join(" · ")}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
