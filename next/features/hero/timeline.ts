/**
 * The hero story as a function of scroll progress (0 → 1).
 * Shared by the WebGL scene and the DOM overlay so they never drift apart.
 */

export const stages = [
  { id: "void", label: "Void", start: 0 },
  { id: "converge", label: "Converge", start: 0.1 },
  { id: "form", label: "Form", start: 0.38 },
  { id: "dive", label: "Dive", start: 0.58 },
  { id: "portal", label: "Portal", start: 0.8 },
] as const;

export type StageId = (typeof stages)[number]["id"];

export type Phases = {
  converge: number;
  form: number;
  dive: number;
  portal: number;
  exit: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function phasesAt(p: number): Phases {
  return {
    converge: smooth(range(p, 0.04, 0.42)),
    form: smooth(range(p, 0.32, 0.58)),
    dive: inOutCubic(range(p, 0.56, 0.86)),
    portal: smooth(range(p, 0.76, 0.94)),
    exit: smooth(range(p, 0.94, 1)),
  };
}

export function stageAt(p: number): (typeof stages)[number] {
  let current: (typeof stages)[number] = stages[0];
  for (const stage of stages) if (p >= stage.start) current = stage;
  return current;
}

/** Mutable state shared between ScrollTrigger and the render loop (never React state). */
export type LiveState = {
  /** Raw scroll progress from ScrollTrigger. */
  progress: number;
  /** Scroll velocity in px/s, used for chromatic aberration and streaks. */
  velocity: number;
  /** Pointer in normalised device coords (-1 → 1). */
  pointer: { x: number; y: number };
};

export function createLiveState(): LiveState {
  return { progress: 0, velocity: 0, pointer: { x: 0, y: 0 } };
}
