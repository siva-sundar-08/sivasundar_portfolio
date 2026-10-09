/**
 * Motion presets shared by Motion (Framer Motion) and GSAP.
 * Nothing here tweens linearly: every curve has weight at one end.
 */

export const ease = {
  /** Fast start, long soft landing. Default for reveals. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Symmetric warp for things that leave and arrive (page, panels). */
  warp: [0.83, 0, 0.17, 1],
  /** Slight overshoot for micro-interactions. */
  snap: [0.34, 1.56, 0.64, 1],
} as const;

export const gsapEase = {
  outExpo: "expo.out",
  warp: "warp",
  inOut: "power3.inOut",
  out: "power3.out",
} as const;

export const spring = {
  /** Magnetic pull toward the pointer. */
  magnetic: { stiffness: 170, damping: 14, mass: 0.35 },
  /** 3D card tilt. */
  tilt: { stiffness: 200, damping: 20, mass: 0.6 },
  /** The cursor ring trailing the dot. */
  cursor: { stiffness: 520, damping: 38, mass: 0.35 },
  /** Panels and sheets. */
  panel: { stiffness: 260, damping: 30 },
} as const;

export const duration = {
  micro: 0.18,
  ui: 0.45,
  reveal: 0.9,
  cinematic: 1.6,
} as const;

export const stagger = {
  letters: 0.035,
  items: 0.08,
  sections: 0.14,
} as const;
