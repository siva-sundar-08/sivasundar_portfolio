"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import type { LiveState } from "./timeline";

type FrameSequenceProps = {
  live: LiveState;
  count: number;
  pattern: string;
  width: number;
  height: number;
  active: boolean;
};

const frameUrl = (pattern: string, index: number) =>
  pattern.replace("{i}", String(index + 1).padStart(4, "0"));

/**
 * Option A: a pre-rendered frame sequence scrubbed by scroll progress.
 * Frames load progressively (every 8th first, then the gaps), so scrubbing
 * works early with coarse frames and sharpens as the rest arrive.
 */
export default function FrameSequence({
  live,
  count,
  pattern,
  width,
  height,
  active,
}: FrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<Array<HTMLImageElement | undefined>>([]);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const seen = new Set<number>();
    const order: number[] = [];
    for (const step of [8, 4, 2, 1]) {
      for (let i = 0; i < count; i += step) {
        if (!seen.has(i)) {
          seen.add(i);
          order.push(i);
        }
      }
    }

    let cursor = 0;
    const loadNext = () => {
      if (cancelled || cursor >= order.length) return;
      const index = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(pattern, index);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        frames.current[index] = img.naturalWidth ? img : undefined;
        setLoaded((n) => n + 1);
        loadNext();
      };
    };
    for (let lane = 0; lane < 6; lane++) loadNext();
    return () => {
      cancelled = true;
    };
  }, [count, pattern]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let last = -1;

    const draw = () => {
      const target = Math.round(live.progress * (count - 1));
      if (target === last) return;
      // Fall back to the nearest frame that has loaded.
      for (let offset = 0; offset < count; offset++) {
        const img = frames.current[target - offset] ?? frames.current[target + offset];
        if (img) {
          const scale = Math.max(canvas.width / width, canvas.height / height);
          const w = width * scale;
          const h = height * scale;
          ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          last = target;
          return;
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      last = -1;
    };
    resize();
    window.addEventListener("resize", resize);
    gsap.ticker.add(draw);
    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(draw);
    };
  }, [active, count, width, height, live]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />
      {loaded < count ? (
        <div className="absolute right-6 bottom-24 hud tabular-nums" aria-hidden>
          Buffering {Math.round((loaded / count) * 100)}%
        </div>
      ) : null}
    </>
  );
}
