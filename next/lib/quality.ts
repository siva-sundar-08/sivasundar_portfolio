export type Quality = "high" | "low" | "static";

type ExtendedNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * Pick a render tier for WebGL scenes.
 * - static: reduced motion, no WebGL2, or Save-Data → poster only
 * - low: phones, tablets, ≤4 cores or ≤4 GB → fewer particles, no post-processing
 * - high: everything on
 */
export function detectQuality(): Quality {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";

  const nav = navigator as ExtendedNavigator;
  if (nav.connection?.saveData) return "static";

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) return "static";
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 820px)").matches;

  if (touch || narrow || cores <= 4 || memory <= 4) return "low";
  return "high";
}

export const qualitySettings = {
  high: { particles: 9000, dpr: [1, 1.75] as [number, number], post: true },
  low: { particles: 3500, dpr: [1, 1.25] as [number, number], post: false },
} as const;
