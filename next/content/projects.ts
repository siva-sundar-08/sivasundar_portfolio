import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "todotask",
    code: "PRJ//01",
    title: "TodoTask",
    category: "mobile",
    summary:
      "Task management mobile app focused on clean productivity flows, structured screens, and practical day-to-day usability.",
    overview: [
      "TodoTask is a native iPhone app for capturing and finishing everyday tasks without friction. The interface keeps one input at the top, a segmented filter for All, Active and Completed, and a list that stays readable as it grows.",
      "The build is a study in SwiftUI fundamentals: state-driven lists, clear visual states for done and pending items, and native controls that feel at home on iOS.",
    ],
    highlights: [
      "Single-field quick add with an inline action",
      "All / Active / Completed segmented filtering",
      "Native SwiftUI list with clear completion states",
    ],
    stack: ["Swift", "SwiftUI", "Xcode"],
    repo: "https://github.com/siva-sundar-08/TodoTask",
    cover: {
      src: "/images/mobile-dashboard.png",
      width: 1206,
      height: 2622,
      alt: "TodoTask on iPhone: a MyTask list with an add field, All/Active/Completed filter and checked items",
    },
    hue: 350,
  },
  {
    slug: "playspace-flutter",
    code: "PRJ//02",
    title: "Playspace",
    category: "mobile",
    summary:
      "Booking and activity-based mobile app for recreation workflows with cross-platform UI, navigation flow, and an interactive booking experience.",
    overview: [
      "Playspace is a cross-platform app for discovering recreation activities and booking them. It focuses on the path from browsing to a confirmed slot, with navigation that keeps that path short.",
      "Built in Flutter and Dart, it explores reusable widgets and a single codebase that targets both iOS and Android.",
    ],
    highlights: [
      "Browse-to-booking flow with minimal steps",
      "Cross-platform UI from one Flutter codebase",
      "Interactive booking states and navigation",
    ],
    stack: ["Flutter", "Dart"],
    repo: "https://github.com/siva-sundar-08/playspace-flutter",
    hue: 190,
  },
  {
    slug: "liver-disease-prediction",
    code: "PRJ//03",
    title: "Liver Disease Prediction",
    category: "web",
    summary:
      "AI-assisted clinical screening interface with prediction flow, image detection, reports, and profile screens.",
    overview: [
      "A web interface for an AI-assisted liver disease screening tool. It guides a user through entering clinical values or uploading an image, then presents the prediction alongside a report.",
      "The work centred on making a dense, high-stakes flow feel calm and legible: clear steps, readable results, and profile and report screens that tie it together.",
    ],
    highlights: [
      "Step-by-step prediction flow",
      "Image detection and report screens",
      "Profile management views",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    hue: 160,
  },
  {
    slug: "portfolio",
    code: "PRJ//04",
    title: "Personal Portfolio",
    category: "web",
    summary:
      "Interactive developer portfolio focused on bold presentation, motion, contact flow, and project storytelling.",
    overview: [
      "The previous version of this site: a React and Vite portfolio with GSAP scroll animation, a Lottie hero, a custom cursor and a direct-to-inbox contact form.",
      "It laid the groundwork for this rebuild, which moves to Next.js, real-time WebGL and a scroll-driven cinematic sequence.",
    ],
    highlights: [
      "GSAP ScrollTrigger reveals across every section",
      "Lottie hero animation and custom cursor",
      "Separate mobile and web project pages",
    ],
    stack: ["React", "JavaScript", "Tailwind CSS", "GSAP"],
    repo: "https://github.com/siva-sundar-08/sivasundar_portfolio",
    hue: 275,
  },
  {
    slug: "iot-smart-cart",
    code: "PRJ//05",
    title: "IoT Smart Cart",
    category: "web",
    summary:
      "Presentation website for an RFID-enabled smart shopping cart, covering workflow, features, and a gallery.",
    overview: [
      "A showcase site for an RFID-enabled shopping cart that scans items as they go in. The site explains the hardware workflow, the feature set and the build through a gallery.",
    ],
    highlights: ["Workflow walkthrough", "Feature breakdown", "Hardware gallery"],
    stack: ["HTML", "CSS", "JavaScript"],
    hue: 75,
  },
  {
    slug: "iot-weather-monitoring",
    code: "PRJ//06",
    title: "IoT Weather Monitor",
    category: "web",
    summary:
      "Showcase page for real-time environmental monitoring, cloud analytics, and hardware workflow details.",
    overview: [
      "A project page for an IoT weather station that streams environmental readings to the cloud for analysis. It documents the sensors, the data path and the hardware workflow.",
    ],
    highlights: ["Real-time readings", "Cloud analytics overview", "Hardware workflow"],
    stack: ["HTML", "CSS", "JavaScript"],
    hue: 205,
  },
  {
    slug: "food-delivery-ui",
    code: "PRJ//07",
    title: "Food Delivery UI",
    category: "web",
    summary:
      "Frontend for food ordering flows with product browsing, a clear action hierarchy, and a responsive layout.",
    overview: [
      "Front-end interface work for a food ordering experience: browsing dishes, adding them to an order, and keeping the primary action obvious on every screen size.",
    ],
    highlights: ["Product browsing", "Clear action hierarchy", "Responsive layout"],
    stack: ["HTML", "CSS", "JavaScript"],
    hue: 20,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
