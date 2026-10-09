"use client";

import { useSyncExternalStore } from "react";
import { detectQuality, type Quality } from "./quality";

export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

let cachedQuality: Quality | null = null;
const noopSubscribe = () => () => {};

/** Render tier for WebGL; `null` during SSR and the first hydration pass. */
export function useQuality(): Quality | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => (cachedQuality ??= detectQuality()),
    () => null,
  );
}
