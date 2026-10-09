"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ModeProvider } from "./ModeProvider";
import { SmoothScroll } from "./SmoothScroll";
import { SoundProvider } from "./SoundProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ModeProvider>
        <SoundProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </SoundProvider>
      </ModeProvider>
    </MotionConfig>
  );
}
