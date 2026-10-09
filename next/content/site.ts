import type { ImageAsset, SocialLink } from "./types";

export const site = {
  name: "Siva Sundar",
  firstName: "Siva",
  lastName: "Sundar",
  year: 2026,
  roles: ["iOS App Developer", "Web Developer"],
  title: "Siva Sundar — iOS & Web Developer",
  description:
    "Siva Sundar is an iOS-focused developer building SwiftUI apps and motion-rich web interfaces.",
  tagline:
    "I build polished product interfaces with a bias toward motion, structure, and clean front-end execution across web and mobile.",
  bio: [
    "I'm Siva Sundar, an iOS-focused developer who enjoys building clean, structured, and usable interfaces. My strongest interest is in crafting mobile experiences with clear navigation, practical interaction design, and product thinking that translates well across both app and web interfaces.",
    "I place more importance on iPhone application development, especially UI building in SwiftUI, while also using frontend web skills to design, present, and ship complete digital experiences.",
  ],
  specs: [
    { label: "Primary", value: "iOS · SwiftUI" },
    { label: "Secondary", value: "React · Web" },
    { label: "Backend", value: "Java · Spring Boot" },
    { label: "Internships", value: "02 completed" },
  ],
  cvUrl:
    "https://drive.google.com/file/d/1yU2qlXJwt_IL1XOZVh8M_uM00A78jgsI/view?usp=sharing",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  portrait: {
    src: "/images/profile.jpg",
    width: 896,
    height: 940,
    alt: "Portrait of Siva Sundar in a dark jacket against a black background",
  } satisfies ImageAsset,
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/siva-sundar-08",
      handle: "siva-sundar-08",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/siva-sundar-g-b0636225a/",
      handle: "siva-sundar-g",
    },
  ] satisfies SocialLink[],
} as const;

export const sections = [
  { id: "hero", code: "SYS//00", label: "Signal" },
  { id: "about", code: "SYS//01", label: "Operator" },
  { id: "skills", code: "SYS//02", label: "Systems" },
  { id: "experience", code: "SYS//03", label: "Trajectory" },
  { id: "contact", code: "SYS//04", label: "Uplink" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
