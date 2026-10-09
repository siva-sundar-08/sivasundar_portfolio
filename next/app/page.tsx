import { Suspense, ViewTransition } from "react";
import { Footer } from "@/components/ui/Footer";
import { About } from "@/features/about/About";
import { Contact } from "@/features/contact/Contact";
import { Experience } from "@/features/experience/Experience";
import { Hero } from "@/features/hero/Hero";
import { Projects } from "@/features/projects/Projects";
import { Skills } from "@/features/skills/Skills";

/**
 * Each section sits in its own Suspense boundary so React hydrates them
 * selectively, in small tasks, instead of one long main-thread block.
 */
export default function HomePage() {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative">
        <Hero />
        <Suspense>
          <About />
        </Suspense>
        <Suspense>
          <Projects />
        </Suspense>
        <Suspense>
          <Skills />
        </Suspense>
        <Suspense>
          <Experience />
        </Suspense>
        <Suspense>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </ViewTransition>
  );
}
