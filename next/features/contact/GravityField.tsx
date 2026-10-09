"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; hue: 0 | 1 | 2 };

/**
 * A 2D gravitational field behind the contact panel: particles orbit a
 * well that follows the pointer (or rests at the panel's centre), with
 * velocity-stretched trails. Canvas 2D, ~160 particles, paused off-screen.
 */
export function GravityField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const styles = getComputedStyle(document.documentElement);
    const colour = (name: string) => styles.getPropertyValue(name).trim() || "#3ef0ff";
    let palette = [colour("--accent"), colour("--accent-2"), colour("--accent-3")];
    let background = colour("--void-0");
    const modeObserver = new MutationObserver(() => {
      const next = getComputedStyle(document.documentElement);
      palette = ["--accent", "--accent-2", "--accent-3"].map(
        (n) => next.getPropertyValue(n).trim() || "#3ef0ff",
      );
      background = next.getPropertyValue("--void-0").trim() || "#030309";
    });
    modeObserver.observe(document.documentElement, { attributeFilter: ["data-mode"] });

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const well = { x: 0, y: 0, tx: 0, ty: 0, strength: 0.6 };
    const particles: Particle[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      well.tx = well.x = width / 2;
      well.ty = well.y = height / 2;
    };
    resize();

    const count = width < 700 ? 90 : 160;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 80 + Math.random() * Math.max(width, height) * 0.5;
      particles.push({
        x: width / 2 + Math.cos(a) * d,
        y: height / 2 + Math.sin(a) * d,
        vx: -Math.sin(a) * 1.6,
        vy: Math.cos(a) * 1.6,
        r: 0.6 + Math.random() * 1.6,
        hue: (i % 3) as 0 | 1 | 2,
      });
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      well.tx = event.clientX - rect.left;
      well.ty = event.clientY - rect.top;
      well.strength = 1.1;
    };
    const onLeave = () => {
      well.tx = width / 2;
      well.ty = height / 2;
      well.strength = 0.6;
    };
    const section = canvas.parentElement;
    section?.addEventListener("pointermove", onMove);
    section?.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let running = false;
    const frame = () => {
      well.x += (well.tx - well.x) * 0.08;
      well.y += (well.ty - well.y) * 0.08;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        const dx = well.x - p.x;
        const dy = well.y - p.y;
        const dist2 = dx * dx + dy * dy + 900;
        const force = (well.strength * 1800) / dist2;
        const inv = 1 / Math.sqrt(dist2);
        p.vx += dx * inv * force;
        p.vy += dy * inv * force;
        p.vx *= 0.992;
        p.vy *= 0.992;
        const px = p.x;
        const py = p.y;
        p.x += p.vx;
        p.y += p.vy;

        ctx.strokeStyle = palette[p.hue];
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = p.r;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    visibility.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      visibility.disconnect();
      modeObserver.disconnect();
      window.removeEventListener("resize", resize);
      section?.removeEventListener("pointermove", onMove);
      section?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full opacity-70" />;
}
