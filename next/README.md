# Siva Sundar — Portfolio 2050

A rebuild of the portfolio as a spatial, motion-first site: a scroll-scrubbed WebGL
sequence, glass interfaces floating in depth, and content that resolves out of noise.

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP +
ScrollTrigger · Lenis · Motion · React Three Fiber + drei + postprocessing.

The original Vite site still lives at the repository root, untouched. This app is
self-contained in `next/`.

## Setup

```bash
cd next
npm install
cp .env.example .env.local   # optional in development
npm run dev                  # http://localhost:3000
```

| Script                        | What it does                                          |
| ----------------------------- | ----------------------------------------------------- |
| `npm run dev`                 | Dev server (Turbopack)                                |
| `npm run build` / `npm start` | Production build / serve it                           |
| `npm run typecheck`           | `tsc --noEmit` in strict mode                         |
| `npm run lint`                | ESLint (Next core-web-vitals + TypeScript + Prettier) |
| `npm run format`              | Prettier (with Tailwind class sorting)                |
| `npm run check`               | Typecheck, lint, format check and build in one go     |
| `npm run frames -- video.mp4` | Turn a video into the hero frame sequence (below)     |

### Environment

- `NEXT_PUBLIC_SITE_URL`: canonical origin for metadata, sitemap, robots and JSON-LD.
  Defaults to `http://localhost:3000`.
- `CONTACT_FORMSUBMIT_ID`: where the contact form's Server Action sends messages, via
  [FormSubmit](https://formsubmit.co). Use your email once to receive the activation
  mail, then switch to the random alias it gives you so your address never appears
  anywhere. If it's unset in development, messages are logged to the terminal. If it's
  unset in production, the form politely refuses and points to LinkedIn.

## Structure

```
next/
├─ app/                 routes, metadata, sitemap, robots, OG image, icon
│  └─ page.tsx          home (server component composing the sections)
├─ components/
│  ├─ nav/              floating glass nav: progress ring, section HUD, sound, mode, menu
│  ├─ providers/        Lenis smooth scroll, Void/Aurora mode, ambient sound
│  └─ ui/               Cursor, Magnetic, ScrambleText, MorphHeading, SectionHeader, Footer
├─ features/            one folder per section
│  ├─ hero/             scroll sequence, overlay, frame-sequence player, WebGL scene + GLSL
│  └─ about/ skills/ experience/ contact/
├─ content/             all copy and data, typed (site, skills, experience, hero)
├─ lib/                 GSAP registration, motion presets, quality tiers, hooks
├─ styles/globals.css   design tokens, glass/HUD utilities, view transitions, grain
├─ public/images/       portrait
├─ scripts/             extract-frames.sh
└─ docs/                DESIGN-SYSTEM.md, ASSETS.md
```

Server components are the default. Client components are limited to things that move or
respond: the hero, the scroll-driven sections, the nav, the cursor and the form.

## Swapping content

Everything visible comes from `content/*.ts`. The types in `content/types.ts` keep it consistent.

- **Bio, roles, links, CV, spec panels**: `content/site.ts`
- **Skills**: `content/skills.ts`, sourced from your GitHub repos. Each group is one orbit ring; add a group and a ring appears.
- **Experience**: `content/experience.ts`
- **Section codes and labels** (`SYS//01 · Operator` …): `sections` in `content/site.ts`

## The hero sequence

### Why a real-time scene (Option B)

The sequence is a live React Three Fiber scene rather than a pre-rendered frame sequence:

- There is no source video yet, and a frame sequence needs one.
- A typical 150-frame WebP sequence is 6–15 MB. The scene's JS is about 1 MB and
  looks sharp at any resolution.
- It reacts to the pointer, the Void/Aurora mode and scroll velocity. Pre-rendered frames can't.

The story is driven by one scroll value (`features/hero/timeline.ts`), which the scene
and the DOM overlay share:

| Progress    | Stage    | What happens                                                                                       |
| ----------- | -------- | -------------------------------------------------------------------------------------------------- |
| 0.00 – 0.10 | Void     | Nebula shader field, scattered drifting particles                                                  |
| 0.10 – 0.38 | Converge | Up to 9k particles spiral onto a Fibonacci shell and an equatorial ring                            |
| 0.38 – 0.58 | Form     | A liquid-metal core grows (noise-displaced, iridescent fresnel) and orbital rings appear           |
| 0.58 – 0.80 | Dive     | The camera flies through; the shell dissolves with glowing edges; particles become a light tunnel  |
| 0.80 – 1.00 | Portal   | A swirling portal disc; the name assembles through an SVG displacement field; the canvas fades out |

Performance safeguards:

- **Nothing 3D loads until intent.** WebGL is dynamically imported (`ssr: false`) on the
  visitor's first scroll, pointer move, touch or key press. Until then a CSS poster holds
  the frame, so first load does no GPU work.
- **Quality tiers** (`lib/quality.ts`):
  - `high`: 9k particles, bloom, chromatic aberration, noise and vignette.
  - `low`: phones, tablets, and devices with ≤4 cores or ≤4 GB of memory. 3.5k particles,
    no post-processing, DPR ≤ 1.25.
  - `static`: reduced motion, Save-Data, or no WebGL2. Poster only.
- drei's `PerformanceMonitor` lowers DPR and turns off post-processing if the frame rate drops.
- The render loop pauses (`frameloop="never"`) while the hero is off-screen.

### Switching to a frame sequence (Option A)

1. `brew install ffmpeg`
2. `npm run frames -- ~/Movies/hero.mp4 30 1600` (fps and width are optional)
3. Paste the block it prints into `content/hero.ts`.

Frames are written to `public/sequence/` as WebP and load progressively: every 8th frame
first, then the gaps. Scrubbing works almost immediately and sharpens as the rest
arrive. The overlay, HUD and name reveal work the same either way.

## Motion & accessibility

- With `prefers-reduced-motion`, there's no Lenis, no WebGL, and no pinning or scrubbing.
  The hero collapses to one screen with the name visible, scramble text renders plain,
  and CSS animations and view transitions are turned off.
- Every custom control is a real `<button>` or `<a>` with a visible focus ring. The skill
  orbit is keyboard-navigable on desktop. On touch screens it's decorative, and the legend
  list carries the content.
- Scrambled text is `aria-hidden`, with the plain text alongside for screen readers.
- The custom cursor only replaces the native one on fine pointers, and only after it mounts.

## Quality (local production build, Lighthouse 12)

| Page        | Performance | Accessibility | Best practices | SEO | CLS |
| ----------- | ----------- | ------------- | -------------- | --- | --- |
| `/` desktop | 99          | 100           | 100            | 100 | 0   |
| `/` mobile  | 92          | 100           | 100            | 100 | 0   |

Lighthouse doesn't scroll or interact, so these scores measure first load. The 3D scene's
cost comes after the first interaction, by design.

## Known trade-offs

- The variable-font heading morph changes letter widths as you scroll. Each heading is a
  single left-aligned text node, so nothing around it shifts, but the heading's own width does.
- In development, edits to `styles/globals.css` sometimes don't hot-reload with the
  Turbopack Tailwind loader. Restart `npm run dev` if a CSS change doesn't appear.

See `docs/DESIGN-SYSTEM.md` for tokens, motion presets and components, and
`docs/ASSETS.md` for the assets still needed.
