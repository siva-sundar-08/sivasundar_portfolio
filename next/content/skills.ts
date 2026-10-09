import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    id: "mobile",
    title: "Mobile",
    summary:
      "Native iPhone and iPad interfaces with clean structure, interaction clarity, and maintainable UI code.",
    skills: ["Swift", "SwiftUI", "UIKit", "Flutter", "Dart"],
  },
  {
    id: "web",
    title: "Web",
    summary:
      "Responsive front-end implementation for portfolio and product interfaces across desktop and mobile.",
    skills: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind", "GSAP"],
  },
  {
    id: "tools",
    title: "Tools",
    summary:
      "The tools and foundations used to build, iterate, version, and explore interface ideas.",
    skills: ["Xcode", "Git", "GitHub", "UI/UX", "Swift Playgrounds"],
  },
];

export const skillHighlights = [
  "Native mobile UI building",
  "Responsive web interfaces",
  "Version control workflow",
  "Product-focused UI thinking",
];
