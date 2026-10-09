import { ViewTransition } from "react";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/features/hero/Hero";

export default function HomePage() {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative">
        <Hero />
      </main>
      <Footer />
    </ViewTransition>
  );
}
