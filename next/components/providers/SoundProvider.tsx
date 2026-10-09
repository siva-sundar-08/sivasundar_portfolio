"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

type Drone = {
  ctx: AudioContext;
  master: GainNode;
};

/**
 * Ambient drone synthesised with Web Audio: two detuned low oscillators and
 * filtered noise, slowly modulated. No audio file to download, and nothing
 * plays until the visitor opts in.
 */
function createDrone(): Drone {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 6;
  filter.connect(master);

  for (const [freq, detune] of [
    [55, -7],
    [82.4, 5],
    [110, 11],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    osc.connect(gain).connect(filter);
    osc.start();
  }

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.015;
  noise.connect(noiseGain).connect(filter);
  noise.start();

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  return { ctx, master };
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const droneRef = useRef<Drone | null>(null);

  const toggle = useCallback(() => setEnabled((value) => !value), []);

  useEffect(() => {
    if (!enabled) {
      const drone = droneRef.current;
      if (drone) {
        drone.master.gain.setTargetAtTime(0, drone.ctx.currentTime, 0.4);
        const timeout = window.setTimeout(() => void drone.ctx.suspend(), 1600);
        return () => window.clearTimeout(timeout);
      }
      return;
    }
    droneRef.current ??= createDrone();
    const { ctx, master } = droneRef.current;
    void ctx.resume();
    master.gain.setTargetAtTime(0.35, ctx.currentTime, 1.2);
  }, [enabled]);

  useEffect(() => () => void droneRef.current?.ctx.close(), []);

  return <SoundContext value={{ enabled, toggle }}>{children}</SoundContext>;
}

export function useSound(): SoundContextValue {
  const value = useContext(SoundContext);
  if (!value) throw new Error("useSound must be used inside <SoundProvider>");
  return value;
}
