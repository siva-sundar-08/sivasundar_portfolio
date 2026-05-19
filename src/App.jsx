import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import WebProjectsPage from "./components/WebProjectsPage";
import MobileProjectsPage from "./components/MobileProjectsPage";

function PortfolioHome() {
  return (
    <main className="relative z-10">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.16),_transparent_30%),radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.06),_transparent_22%)]" />
        <Navbar />
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/projects/mobile" element={<MobileProjectsPage />} />
          <Route path="/projects/web" element={<WebProjectsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
