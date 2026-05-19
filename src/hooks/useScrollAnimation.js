import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export default function useScrollAnimation(animation) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!ref.current) {
        return;
      }

      const ctx = gsap.context(() => {
        animation(ref.current);
      }, ref);

      return () => ctx.revert();
    },
    { scope: ref },
  );

  return ref;
}
