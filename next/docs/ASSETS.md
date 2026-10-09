# Assets to provide

Everything below has a working placeholder today. Swap in the real thing whenever it's ready.

| Asset                                   | Used for                                | Placeholder now                                                         | Format and size                                                                                                      |
| --------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Project screenshots** (6 projects)    | Gallery cards and case-study heroes     | Holographic field tinted per project                                    | PNG/JPG/WebP. Phone screens ≥ 1170 px wide, or desktop shots ≥ 1600 px wide. Add as `cover` in `content/projects.ts` |
| **Case-study write-ups**                | `overview` and `highlights` per project | Drafted from the old one-line summaries. **Please review for accuracy** | Two or three short paragraphs, three highlights each                                                                 |
| **Repo or live links** for web projects | "Source" on case studies                | Missing for Liver Disease, Smart Cart, Weather Monitor, Food Delivery   | URLs in `content/projects.ts` (`repo`, `live`)                                                                       |
| **Hero video** (optional)               | Option A frame sequence                 | Real-time WebGL scene                                                   | 6–10 s, 1920×1080 or larger, ProRes/H.264; slow continuous camera motion works best                                  |
| **Logo / monogram** (optional)          | Nav, favicon, OG image                  | Generated "SS" monogram (`app/icon.tsx`)                                | SVG                                                                                                                  |
| **OG image** (optional)                 | Link previews                           | Generated in `app/opengraph-image.tsx`                                  | 1200×630 PNG, or keep the generated one                                                                              |
| **Ambient sound** (optional)            | Sound toggle                            | Synthesised drone (Web Audio, no file)                                  | Seamless loop, 30–60 s, OGG + M4A, ≤ 500 KB                                                                          |
| **Production domain**                   | Canonical URLs, sitemap, JSON-LD        | `http://localhost:3000`                                                 | Set `NEXT_PUBLIC_SITE_URL`                                                                                           |
| **FormSubmit alias**                    | Contact form delivery                   | Messages logged in dev                                                  | Set `CONTACT_FORMSUBMIT_ID`                                                                                          |

Already migrated from the old site: portrait (`public/images/profile.jpg`, which was a JPEG
named `.png`), the TodoTask screenshot (now its cover), bio, roles, skills, internships,
GitHub, LinkedIn and the CV link.
