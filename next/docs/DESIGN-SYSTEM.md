# Design system

Post-screen, spatial interface. Near-black void, light that seems to come from inside
objects, glass that floats in depth, and type that behaves like a material.

## Tokens (`styles/globals.css`)

All colours are CSS custom properties on `:root`, re-pointed by `[data-mode="aurora"]`.
Tailwind sees them through `@theme inline`, so `text-accent`, `bg-void-1` etc. follow the mode.

| Token                                 | Void                  | Aurora              | Use                                        |
| ------------------------------------- | --------------------- | ------------------- | ------------------------------------------ |
| `--void-0`                            | `#030309`             | `#02080b`           | Page background                            |
| `--void-1`, `--void-2`                | indigo depths         | teal depths         | Background gradients, media wells          |
| `--ink` / `--ink-dim` / `--ink-faint` | 100% / 70% / 52%      | same                | Body / secondary / HUD text (all ≥ 4.5:1)  |
| `--accent`                            | cyan `#3ef0ff`        | acid lime `#c8ff3d` | Primary signal: CTAs, active states, focus |
| `--accent-2`                          | ultraviolet `#8b5cff` | cyan                | Secondary glow, gradients                  |
| `--accent-3`                          | hot magenta `#ff3dc0` | ultraviolet         | Used sparingly: edges, dissolve glow       |
| `--glass-fill`, `--glass-edge-a/b`    |                       |                     | Glass panel fill and 1px gradient rim      |
| `--radius-panel` / `--radius-chip`    | 28px / pill           |                     |                                            |

The WebGL palette mirrors these in `features/hero/scene/HeroScene.tsx` (`PALETTES`) and
eases between modes rather than snapping.

### Type

- **Display:** Anybody (variable, `wdth` 50–150 and `wght`), loaded with `next/font`.
  The `display-wide` utility sets it at full width, 800 weight, 0.88 line height.
- **HUD:** JetBrains Mono, via the `hud` utility: 11px, 0.24em tracking, uppercase, `--ink-faint`.
  Used for section codes (`SYS//02`), coordinates, labels and metadata.

### Utilities

| Utility        | What it is                                                                                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `glass`        | Blurred translucent fill, inner highlight, deep shadow, and a 1px gradient rim drawn with a masked `::before`. Set `[--glass-blur:Npx]` to adjust. It positions itself `relative`; use `absolute!` / `fixed!` to override. |
| `hud`          | Monospace micro-label                                                                                                                                                                                                      |
| `display-wide` | Wide display headline                                                                                                                                                                                                      |
| `holo-text`    | Holographic gradient text                                                                                                                                                                                                  |
| `.grain`       | Fixed film-grain overlay (SVG turbulence, stepped animation)                                                                                                                                                               |

## Motion presets (`lib/motion.ts`)

Nothing tweens linearly. Scroll-scrubbed timelines use `ease: "none"` internally but are
smoothed by `scrub` and Lenis, so what you feel still has weight.

| Name              | Value                                               | Use                                       |
| ----------------- | --------------------------------------------------- | ----------------------------------------- |
| `ease.outExpo`    | `cubic-bezier(0.16, 1, 0.3, 1)`                     | Default reveal: fast start, long landing  |
| `ease.warp`       | `cubic-bezier(0.83, 0, 0.17, 1)`                    | Things leaving and arriving (menu, pages) |
| `ease.snap`       | `cubic-bezier(0.34, 1.56, 0.64, 1)`                 | Micro-interactions with slight overshoot  |
| `spring.magnetic` | stiffness 170, damping 14                           | Magnetic pull                             |
| `spring.tilt`     | stiffness 200, damping 20                           | Card tilt                                 |
| `spring.cursor`   | stiffness 520, damping 38                           | Cursor ring trailing the dot              |
| `spring.panel`    | stiffness 260, damping 30                           | Nav pill, sheets                          |
| `duration.*`      | micro 0.18 · ui 0.45 · reveal 0.9 · cinematic 1.6 s |                                           |

The same curves exist as CSS variables (`--ease-out-expo`, `--ease-warp`, `--ease-snap`)
and as a GSAP CustomEase named `warp`.

**Layering:** backgrounds move slowest (nebula, gradients), midground at scroll speed,
foreground HUD panels faster (`data-depth` in About). Staggers: letters 35ms, items 80ms.

## Components

| Component       | Kind   | Notes                                                                                                                                      |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Nav`           | client | Glass pill: scroll-progress ring, live section code, sound toggle, Void/Aurora switch, mobile menu (dialog with Escape and focus handling) |
| `Cursor`        | client | Dot → ring over links and buttons → labelled pill over `[data-cursor="Label"]`. Fine pointers only                                         |
| `Magnetic`      | client | Wrap any CTA: it leans toward the mouse and springs back                                                                                   |
| `ScrambleText`  | client | Glyph noise resolving into text across a scroll range; zero layout shift                                                                   |
| `MorphHeading`  | client | Variable-font width and weight that expand as the heading enters                                                                           |
| `SectionHeader` | server | HUD code + MorphHeading + intro                                                                                                            |
| `ProjectCard`   | client | 3D tilt, moving glare, holographic hover; shared-element morph into `/work/[slug]`                                                         |
| `ProjectMedia`  | server | Cover image or holographic field                                                                                                           |
| `SkillsOrbit`   | client | DOM-based 3D orbit: drag to spin, hover/focus to inspect                                                                                   |
| `GravityField`  | client | Canvas 2D particles orbiting a pointer-driven gravity well                                                                                 |
| `ContactForm`   | client | `useActionState` + Server Action, inline errors, animated success                                                                          |
| `HeroScene`     | client | R3F: Director (smoothing), CameraRig, Nebula, Particles, Core, Rings, Portal, Effects                                                      |

### Writing a new section

1. Add it to `sections` in `content/site.ts` (gives it a code, a label and nav tracking).
2. Make the section element `<section id="…" data-section="…" aria-labelledby="…-title">`.
3. Start with `<SectionHeader section="…" title="…" />`.
4. Do motion with `useGSAP` (scoped, auto-cleanup) or Motion. Return early when
   `prefers-reduced-motion` is set, and make sure the static state reads well.
5. Add it to `app/page.tsx` inside its own `<Suspense>`.
