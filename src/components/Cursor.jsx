import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export default function Cursor() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!ref.current || window.matchMedia("(pointer: coarse)").matches) {
        if (ref.current) {
          ref.current.style.display = "none";
        }
        return;
      }

      const xTo = gsap.quickTo(ref.current, "x", {
        duration: 0.3,
        ease: "power3",
      });
      const yTo = gsap.quickTo(ref.current, "y", {
        duration: 0.3,
        ease: "power3",
      });

      const moveCursor = (event) => {
        xTo(event.clientX - 5);
        yTo(event.clientY - 5);
      };

      const enter = () =>
        gsap.to(ref.current, { scale: 2.5, opacity: 0.5, duration: 0.2 });
      const leave = () =>
        gsap.to(ref.current, { scale: 1, opacity: 1, duration: 0.2 });

      window.addEventListener("mousemove", moveCursor);

      const targets = document.querySelectorAll("a, button, input, textarea");
      targets.forEach((target) => {
        target.addEventListener("mouseenter", enter);
        target.addEventListener("mouseleave", leave);
      });

      return () => {
        window.removeEventListener("mousemove", moveCursor);
        targets.forEach((target) => {
          target.removeEventListener("mouseenter", enter);
          target.removeEventListener("mouseleave", leave);
        });
      };
    },
    { scope: ref },
  );

  return <div ref={ref} id="cursor" className="custom-cursor" />;
}
