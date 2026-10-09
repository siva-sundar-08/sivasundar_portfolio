import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
    CustomEase.create("warp", "0.83,0,0.17,1");
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger, useGSAP };
