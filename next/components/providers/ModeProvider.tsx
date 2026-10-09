"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Mode = "void" | "aurora";

type ModeContextValue = {
  mode: Mode;
  toggleMode: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = "ss-mode";

/** Runs before hydration (inlined in <head>) so the saved mode never flashes. */
export const modeInitScript = `try{var m=localStorage.getItem("${STORAGE_KEY}");if(m==="aurora")document.documentElement.dataset.mode=m}catch(e){}`;

// The <html data-mode> attribute is the single source of truth.
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Mode =>
  document.documentElement.dataset.mode === "aurora" ? "aurora" : "void";
const getServerSnapshot = (): Mode => "void";

export function ModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleMode = useCallback(() => {
    const next: Mode = getSnapshot() === "void" ? "aurora" : "void";
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the switch still works for this visit.
    }
  }, []);

  return <ModeContext value={{ mode, toggleMode }}>{children}</ModeContext>;
}

export function useMode(): ModeContextValue {
  const value = useContext(ModeContext);
  if (!value) throw new Error("useMode must be used inside <ModeProvider>");
  return value;
}
