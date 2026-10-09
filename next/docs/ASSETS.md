# Assets to provide

Everything below has a working placeholder today. Swap in the real thing whenever it's ready.

| Asset                          | Used for                         | Placeholder now                          | Format and size                                                                     |
| ------------------------------ | -------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- |
| **Hero video** (optional)      | Option A frame sequence          | Real-time WebGL scene                    | 6–10 s, 1920×1080 or larger, ProRes/H.264; slow continuous camera motion works best |
| **Logo / monogram** (optional) | Nav, favicon, OG image           | Generated "SS" monogram (`app/icon.tsx`) | SVG                                                                                 |
| **OG image** (optional)        | Link previews                    | Generated in `app/opengraph-image.tsx`   | 1200×630 PNG, or keep the generated one                                             |
| **Ambient sound** (optional)   | Sound toggle                     | Synthesised drone (Web Audio, no file)   | Seamless loop, 30–60 s, OGG + M4A, ≤ 500 KB                                         |
| **Production domain**          | Canonical URLs, sitemap, JSON-LD | `http://localhost:3000`                  | Set `NEXT_PUBLIC_SITE_URL`                                                          |
| **FormSubmit alias**           | Contact form delivery            | Messages logged in dev                   | Set `CONTACT_FORMSUBMIT_ID`                                                         |

Already migrated from the old site: portrait (`public/images/profile.jpg`, which was a JPEG
named `.png`), bio, roles, skills, internships,
GitHub, LinkedIn and the CV link.
