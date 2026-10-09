import type { SkillGroup } from "./types";

/**
 * Sourced from github.com/siva-sundar-08: repo languages, package.json /
 * pom.xml dependencies, Swift imports, and the profile README's stack.
 * Groups render innermost → outermost as orbit rings.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "mobile",
    title: "Mobile",
    summary:
      "Native iPhone apps in SwiftUI with SwiftData persistence and Swift Charts (MoneyLog, TodoTask), plus cross-platform Flutter (Playspace).",
    skills: ["Swift", "SwiftUI", "UIKit", "SwiftData", "Swift Charts", "Flutter", "Dart"],
  },
  {
    id: "backend",
    title: "Backend",
    summary:
      "REST APIs in Java with Spring Boot, JPA and MySQL (Student Management System), and real-time Node.js servers with Express and Socket.IO (incogni.tv).",
    skills: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Node.js",
      "Express",
      "Socket.IO",
      "Firebase",
    ],
  },
  {
    id: "web",
    title: "Web",
    summary:
      "Responsive front ends in React and Next.js with TypeScript, from Vite single-page apps to motion-heavy portfolio builds.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind",
      "Bootstrap",
      "GSAP",
    ],
  },
  {
    id: "tools",
    title: "Tools",
    summary:
      "The tools used to build, test, design and ship: from Xcode and Git to Figma and Postman.",
    skills: ["Xcode", "Git", "GitHub", "VS Code", "Figma", "Postman", "Vite"],
  },
];

export const skillHighlights = [
  "Native mobile UI building",
  "Full-stack Java + React",
  "Real-time web apps",
  "Responsive web interfaces",
  "Version control workflow",
  "Product-focused UI thinking",
];
