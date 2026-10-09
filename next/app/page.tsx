import { ViewTransition } from "react";
import { Footer } from "@/components/ui/Footer";
import { About } from "@/features/about/About";
import { Contact } from "@/features/contact/Contact";
import { Experience } from "@/features/experience/Experience";
import { Hero } from "@/features/hero/Hero";
import { Projects } from "@/features/projects/Projects";
import { Skills } from "@/features/skills/Skills";

export default function HomePage() {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </ViewTransition>
  );
}
